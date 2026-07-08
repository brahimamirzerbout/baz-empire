// BAZ Marketing Hub — Tauri v2 desktop shell.
//
// Tier 1: app menu + system tray + hardened CSP.
// Tier 2: global hotkey (Ctrl+Shift+B toggles window), desktop notifications,
//         and a signed updater pipeline (checks on launch).
//
// Thin native viewport over the Next.js Marketing Hub (loaded via frontendDist).
// This shell contains NO frontend — edit Hub product features in ~/marketing-hub.
// All APIs verified against tauri 2.11.5 + the resolved plugin versions.

use tauri::{
    image::Image,
    menu::{Menu, MenuEvent, MenuItem, PredefinedMenuItem, Submenu},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    AppHandle, Manager, Runtime,
};
use tauri_plugin_global_shortcut::{GlobalShortcutExt, ShortcutState};
use tauri_plugin_notification::NotificationExt;
use tauri_plugin_updater::UpdaterExt;

/// App-wide menu bar: macOS-style app menu + a Window menu.
fn build_app_menu<R: Runtime>(app: &AppHandle<R>) -> tauri::Result<Menu<R>> {
    let reload = MenuItem::with_id(app, "reload", "Reload Hub", true, Some("CmdOrCtrl+R"))?;
    let app_submenu = Submenu::with_items(app, "BAZ Marketing Hub", true, &[
        &reload,
        &PredefinedMenuItem::separator(app)?,
        &PredefinedMenuItem::fullscreen(app, Some("Toggle Fullscreen"))?,
        &PredefinedMenuItem::separator(app)?,
        &PredefinedMenuItem::quit(app, Some("Quit BAZ Marketing Hub"))?,
    ])?;
    let window_submenu = Submenu::with_items(app, "Window", true, &[
        &PredefinedMenuItem::minimize(app, Some("Minimize"))?,
        &PredefinedMenuItem::close_window(app, Some("Close Window"))?,
    ])?;
    Menu::with_items(app, &[&app_submenu, &window_submenu])
}

/// System tray: icon + context menu (Reload / Quit). Left-click shows & focuses.
fn build_tray<R: Runtime>(app: &AppHandle<R>) -> tauri::Result<()> {
    let reload = MenuItem::with_id(app, "tray-reload", "Reload Hub", true, None::<&str>)?;
    let menu = Menu::with_items(app, &[
        &reload,
        &PredefinedMenuItem::separator(app)?,
        &PredefinedMenuItem::quit(app, Some("Quit"))?,
    ])?;
    let icon = Image::from_bytes(include_bytes!("../icons/128x128.png"))?;
    TrayIconBuilder::new()
        .icon(icon)
        .tooltip("BAZ Marketing Hub")
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } = event
            {
                if let Some(win) = tray.app_handle().get_webview_window("main") {
                    let _ = win.show();
                    let _ = win.set_focus();
                }
            }
        })
        .on_menu_event(|app, event| {
            if event.id().as_ref() == "tray-reload" {
                if let Some(win) = app.get_webview_window("main") {
                    let _ = win.reload();
                }
            }
        })
        .build(app)?;
    Ok(())
}

/// Toggle the main window visibility (bound to the global hotkey).
fn toggle_main_window<R: Runtime>(app: &AppHandle<R>) {
    if let Some(win) = app.get_webview_window("main") {
        match win.is_visible() {
            Ok(true) => { let _ = win.hide(); }
            _ => { let _ = win.show(); let _ = win.set_focus(); }
        }
    }
}

/// Fire a desktop notification.
fn notify<R: Runtime>(app: &AppHandle<R>, body: &str) {
    let _ = app
        .notification()
        .builder()
        .title("BAZ Marketing Hub")
        .body(body)
        .show();
}

/// On launch: check for a signed update. If found, notify, install, relaunch.
/// With no manifest hosted yet the check returns an error and is a silent no-op.
fn spawn_update_check<R: Runtime>(app: &AppHandle<R>) {
    let handle = app.clone();
    tauri::async_runtime::spawn(async move {
        let Ok(updater) = handle.updater() else { return };
        match updater.check().await {
            Ok(Some(update)) => {
                notify(&handle, &format!("Downloading update v{}…", update.version));
                match update.download_and_install(|_, _| {}, || {}).await {
                    Ok(()) => {
                        notify(&handle, "Update installed — restarting.");
                        handle.exit(0);
                    }
                    Err(e) => notify(&handle, &format!("Update failed: {e}")),
                }
            }
            _ => {}
        }
    });
}

/// App-menu events (custom ids; predefined items handle themselves).
fn handle_menu_event<R: Runtime>(app: &AppHandle<R>, event: MenuEvent) {
    if event.id().as_ref() == "reload" {
        if let Some(win) = app.get_webview_window("main") {
            let _ = win.reload();
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .menu(|app| build_app_menu(app))
        .on_menu_event(|app, event| handle_menu_event(app, event))
        .setup(|app| {
            build_tray(app.handle())?;
            // Global hotkey: Ctrl+Shift+B toggles the window.
            app.handle().global_shortcut().on_shortcut(
                "CmdOrCtrl+Shift+B",
                |app, _shortcut, event| {
                    if event.state == ShortcutState::Pressed {
                        toggle_main_window(app);
                    }
                },
            )?;
            // Check for updates on launch (non-blocking; no manifest yet -> no-op).
            spawn_update_check(app.handle());
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running BAZ Marketing Hub");
}
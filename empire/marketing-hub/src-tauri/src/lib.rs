// BAZ Marketing Hub — Tauri v2 desktop shell.
//
// Thin native viewport over the Next.js Marketing Hub. This shell contains NO
// frontend — the Hub is loaded remotely (devUrl in dev, frontendDist in prod).
// Native affordances (menu bar, system tray, future shortcuts/updater) live here.
// Edit Hub product features in ~/marketing-hub, not here.
//
// APIs verified against tauri 2.11.5 (the version resolved in the lockfile).

use tauri::{
    image::Image,
    menu::{Menu, MenuEvent, MenuItem, PredefinedMenuItem, Submenu},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    AppHandle, Manager, Runtime,
};

/// App-wide menu bar: macOS-style app menu + a Window menu.
/// Cross-platform (GTK menubar on Linux, app menu on macOS, native on Windows).
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

/// System tray: icon + context menu (Reload / Quit). Left-click shows & focuses
/// the main window (useful when closed to tray in a later iteration).
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

/// Handle app-menu events (custom menu item ids; predefined items handle themselves).
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
        .menu(|app| build_app_menu(app))
        .on_menu_event(|app, event| handle_menu_event(app, event))
        .setup(|app| {
            build_tray(app.handle())?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running BAZ Marketing Hub");
}
// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

pub mod conversation;
pub mod db;

use std::result;

use db::setup_db;
use tauri::{AppHandle, Manager, WindowBuilder};
use window_vibrancy::{apply_blur, apply_vibrancy, NSVisualEffectMaterial, NSVisualEffectState};

use crate::conversation::{
    delete_conversation, get_conversation, get_conversations, save_conversation,
};

#[tokio::main]
async fn main() {
    let app = tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            new_window,
            save_conversation,
            get_conversation,
            get_conversations,
            delete_conversation
        ])
        .plugin(tauri_plugin_store::Builder::default().build())
        .setup(|app| {
            let window = app.get_window("main").unwrap();

            #[cfg(target_os = "macos")]
            apply_vibrancy(
                &window,
                NSVisualEffectMaterial::HudWindow,
                Some(NSVisualEffectState::Active),
                None,
            )
            .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

            #[cfg(target_os = "windows")]
            apply_blur(&window, Some((18, 18, 18, 125)))
                .expect("Unsupported platform! 'apply_blur' is only supported on Windows");

            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error while running tauri application");

    setup_db(&app).await.expect("Could not setup db");

    app.run(|_, _| {});
}

#[tauri::command]
fn new_window(app: AppHandle) {
    let result = WindowBuilder::new(&app, "Chat GPT", tauri::WindowUrl::App("index.html".into()))
        .inner_size(1000 as f64, 800 as f64)
        .build();

    match result {
        Ok(window) => {
            #[cfg(target_os = "macos")]
            apply_vibrancy(
                &window,
                NSVisualEffectMaterial::HudWindow,
                Some(NSVisualEffectState::Active),
                None,
            )
            .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

            #[cfg(target_os = "windows")]
            apply_blur(&window, Some((18, 18, 18, 125)))
                .expect("Unsupported platform! 'apply_blur' is only supported on Windows");
        }
        Err(_) => {}
    }
}

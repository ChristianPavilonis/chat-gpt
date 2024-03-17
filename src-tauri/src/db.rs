use once_cell::sync::Lazy;
use surrealdb::{
    engine::local::{Db, SpeeDb},
    Surreal,
};
use tauri::App;

pub static DB: Lazy<Surreal<Db>> = Lazy::new(|| Surreal::init());

pub async fn setup_db(app: &App) -> Result<(), Box<dyn std::error::Error>> {
    let mut path = app
        .path_resolver()
        .app_data_dir()
        .expect("could not get data_dir");

    match std::fs::create_dir_all(path.clone()) {
        Ok(_) => {}
        Err(err) => {
            panic!("error creating directory {}", err);
        }
    };

    path.push("db.surreal");

    DB.connect::<SpeeDb>(path).await?;

    DB.use_ns("tauri").use_db("tauri").await?;

    Ok(())
}

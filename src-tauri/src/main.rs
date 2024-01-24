// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::env;
use std::fs;
use std::io::Error;
use crate::errors::CommandResult;
mod errors;

#[tauri::command]
fn set_json(data: &str, handle: tauri::AppHandle) -> CommandResult<String> {
  println!(" - : COMMAND : - SETJSON");
  let resource_path: std::path::PathBuf = handle.path_resolver()
  .resolve_resource("json/datas.json")
  .expect(" - ERROR - : Impossible de trouver le JSON");

  let result: Result<(), Error> = fs::write(resource_path, data);
  println!("{}", result.is_ok());
  if result.is_ok() {
    println!(" - RESULT - : [SETJSON] le JSON a été trouvé");
    Ok("true".to_owned())
  } else {
    println!(" - ERROR - : [SETJSON] Impossible de sauvegarder le JSON");
    Ok("false".to_owned())
  }
}

#[tauri::command]
fn get_json(handle: tauri::AppHandle) -> CommandResult<String> {
  println!(" - : COMMAND : - GETJSON");

  let resource_path: std::path::PathBuf = handle.path_resolver()
  .resolve_resource("json/datas.json")
  .expect(" - ERROR - : [GETJSON] Impossible de trouver le JSON");
  let file: fs::File = std::fs::File::open(&resource_path).unwrap();
  let content: serde_json::Value = serde_json::from_reader(file).unwrap();

  Ok(content.to_string())
}


fn main() {
    tauri::Builder::default()
      .invoke_handler(tauri::generate_handler![get_json, set_json])
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
}

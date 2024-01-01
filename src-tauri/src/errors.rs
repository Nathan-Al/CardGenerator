use std::fmt::{Display, Formatter};
use serde::{ser::Serializer, Serialize};
// create the error type that represents all errors possible in our program

#[derive(Debug)]
pub struct CommandError {
    pub message: &'static str,
}

// we must manually implement serde::Serialize
impl Serialize for CommandError {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
  where
    S: Serializer,
  {
    serializer.serialize_str(self.to_string().as_ref())
  }
}

impl Display for CommandError {
  fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
      f.write_str(&self.message)
  }
}

pub type CommandResult<T, E = CommandError> = Result<T, E>;
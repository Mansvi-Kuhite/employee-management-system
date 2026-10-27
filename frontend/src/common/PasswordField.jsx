import { useState } from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function PasswordField(props) {
  const [show, setShow] = useState(false);

  return (
    <TextField
      {...props}
      type={show ? "text" : "password"}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                edge="end"
                onClick={() => setShow(!show)}
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
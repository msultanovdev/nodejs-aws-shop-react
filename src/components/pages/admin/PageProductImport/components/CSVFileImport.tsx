import React, { useRef } from "react";
import { Box, Button } from "@mui/material";
import axios from "axios";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = React.useState<File>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    if (!file) {
      console.error("No file selected for upload.");
      return;
    }

    console.log("uploadFile to", url);

    const response = await axios({
      method: "GET",
      url,
      params: {
        name: encodeURIComponent(file.name),
      },
    });
    console.log("File to upload: ", file.name);
    console.log("Uploading to: ", response.data);
    const result = await fetch(response.data.url, {
      method: "PUT",
      body: file,
    });
    console.log("Result: ", result);
    setFile(undefined);
  };
  return (
    <Box>
      {file ? (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            size="small"
            color="warning"
            variant="contained"
            onClick={removeFile}
          >
            Remove file
          </Button>
          <Button
            size="small"
            color="secondary"
            variant="contained"
            onClick={uploadFile}
          >
            Upload file
          </Button>
        </div>
      ) : (
        <>
          <input
            hidden
            type="file"
            accept=".csv"
            onChange={onFileChange}
            ref={uploadInputRef}
          />
          <Button
            size="small"
            color="primary"
            variant="contained"
            onClick={() =>
              uploadInputRef.current && uploadInputRef.current.click()
            }
          >
            Import CSV File
          </Button>
        </>
      )}
    </Box>
  );
}

import { Button, Layout, message } from "antd";
import axios from "axios";
import { useRef, useState } from "react";
import "./App.css";

const { Content } = Layout;

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleSelectFile = () => {
    if (!inputFileRef.current) {
      return;
    }

    inputFileRef.current.click();
  };

  const handleOnFileChange = () => {
    if (!inputFileRef.current) {
      return;
    }

    const firstFile = inputFileRef.current.files?.item(0);

    if (firstFile) {
      setFiles([firstFile]);
    }
  };

  const handleUpload = async () => {
    const formatData = new FormData();

    const file = files[0];

    formatData.append(file.name, file);

    try {
      await axios.post("http://localhost:3000/upload", formatData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      message.success("upload successfully.");
    } catch (error) {
      console.error("Error uploading file:", error);
      message.error("Upload error");
    }
  };

  return (
    <>
      <div className="flex justify-center items-center w-screen h-screen">
        <Content className="flex flex-col justify-center items-center text-white text-3xl">
          <input
            type="file"
            ref={inputFileRef}
            style={{ display: "none" }}
            onChange={handleOnFileChange}
          />
          <div className="flex w-[100%] max-w-[250px] justify-between">
            <Button
              type="primary"
              onClick={handleSelectFile}
              className="text-xl"
            >
              Select file
            </Button>
            <Button
              type="primary"
              disabled={files.length === 0}
              onClick={handleUpload}
              className="text-xl"
            >
              Upload File
            </Button>
          </div>
          {files.map((file) => file.name)}
        </Content>
      </div>
    </>
  );
}

export default App;

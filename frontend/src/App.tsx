import { UploadOutlined } from "@ant-design/icons";
import { Button, Layout, message, Upload, UploadFile, UploadProps } from "antd";
import { useState } from "react";
import "./App.css";

const { Content } = Layout;

function App() {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    setUploading(true);
    // You can use any AJAX library you like

    message.success("upload successfully.");
    //message.error("upload failed.");
    setUploading(false);
  };

  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);

      return false;
    },
    fileList,
  };

  return (
    <>
      <div className="flex justify-center items-center w-screen h-screen">
        <Content className="flex flex-col justify-center items-center text-white text-3xl">
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
          <Button
            type="primary"
            onClick={handleUpload}
            disabled={fileList.length === 0}
            loading={uploading}
            style={{ marginTop: 16, color: "white" }}
          >
            {uploading ? "Uploading" : "Start Upload"}
          </Button>
        </Content>
      </div>
    </>
  );
}

export default App;

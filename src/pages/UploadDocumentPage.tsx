import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useKeylessAccounts } from "../core/useKeylessAccounts";

import { useDocumentEncryption } from "../components/document_upload/ipfs/useDocumentEncryption";

function UploadDocument() {
  const navigate = useNavigate();

  const { activeAccount } = useKeylessAccounts();
  const {uploadDocument, isUploading} = useDocumentEncryption()

  useEffect(() => {
    if (!activeAccount) navigate("/");
  }, [activeAccount, navigate]);

  const handleSubmit =async (e:React.FormEvent<HTMLFormElement> )=>{
        e.preventDefault()
        const formData = new FormData(e.currentTarget);
        const file:File = formData.get("file-upload") as File;
        console.log(file)
        console.log(typeof file)
        await uploadDocument(file)
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen px-4">
      <div>
        <h1 className="text-4xl font-bold mb-2">Welcome to Aptos!</h1>
        <p className="text-lg mb-8">You are now logged in</p>

        <div className="grid gap-2">
            <form onSubmit={handleSubmit} encType="multipart/form">
                <UploadInput />
                <button type="submit" disabled={isUploading} > {isUploading ? "Uploading" : "Submit"}</button>
            </form>
        </div>
      </div>
    </div>
  );
}

export default UploadDocument;


function UploadInput() {
    return <div>
        <div className="w-[400px] relative border-2 border-gray-300 border-dashed rounded-lg p-6" id="dropzone">
    <input type="file" className="absolute inset-0 w-full h-full opacity-0 z-50" />
    <div className="text-center">
        <img className="mx-auto h-12 w-12" src="https://www.svgrepo.com/show/357902/image-upload.svg" alt="" />

        <h3 className="mt-2 text-sm font-medium text-gray-900">
            <label htmlFor="file-upload" className="relative cursor-pointer">
                <span>Drag and drop</span>
                <span className="text-indigo-600"> or browse</span>
                <span>to upload</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" />
            </label>
        </h3>
        <p className="mt-1 text-xs text-gray-500">
            PNG, JPG, GIF up to 10MB
        </p>
    </div>

    <img src="" className="mt-4 mx-auto max-h-40 hidden" id="preview" />
</div>


    </div>
}
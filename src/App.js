import React, { useState } from 'react';
import axios from "axios";
import * as XLSX from "xlsx";

function App() {
  const [msg, setmsg] = useState("");
  const [status, setstatus] = useState(false);
  const [emailList, setemailList] = useState([]);

  function handlemsg(evt) {
    setmsg(evt.target.value);
  }

  function handlefile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const emails = XLSX.utils.sheet_to_json(worksheet, { header: 'A' });
      const totalEmail = emails.map(item => item.A);
      setemailList(totalEmail);
    };

    reader.readAsBinaryString(file);
  }

  function send() {
    setstatus(true);
    axios.post("http://https://bulkmail-backend-pied.vercel.app/sendemail", { msg, emailList })
      .then((data) => {
        if (data.data === true) {
          alert("Email Sent Successfully");
        } else {
          alert("Failed to send emails");
        }
        setstatus(false);
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        alert("Failed to send email. Check console for error details.");
        setstatus(false);
      });
  }

  return (
    <div className="text-center">
      <div className="bg-blue-950 text-white py-5"><h1 className="text-2xl font-medium">Bulk Mail</h1></div>
      <div className="bg-blue-800 text-white py-5"><h1 className="font-medium">We can help your business with sending multiple emails at once</h1></div>
      <div className="bg-blue-600 text-white py-5"><h1 className="font-medium">Drag and Drop</h1></div>

      <div className="bg-blue-400 flex flex-col items-center px-5 py-3">
        <textarea onChange={handlemsg} value={msg} className="w-[80%] h-32 py-2 outline-none px-2 border border-black rounded-md" placeholder="Enter the email text"></textarea>
      </div>

      <div className="bg-blue-400">
        <input type="file" onChange={handlefile} className="border-4 border-dashed py-4 px-4 mt-5 mb-5" />
      </div>

      <p className="bg-blue-400">Total Emails in the file: {emailList.length}</p>

      <div className="bg-blue-400">
        <button onClick={send} className="bg-blue-950 px-2 py-2 mt-2 text-white font-medium rounded-md w-fit mb-2">
          {status ? "Sending..." : "Send"}
        </button>
      </div>

      <div className="bg-blue-300 text-white text-center p-8"></div>
      <div className="bg-blue-200 text-white text-center p-8"></div>
    </div>
  );
}

export default App;

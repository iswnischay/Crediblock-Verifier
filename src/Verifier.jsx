import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collectionGroup, getDocs } from "firebase/firestore";
import "./App.css";

const Verifier = () => {
  const [fileName, setFileName] = useState("");
  const [hash, setHash] = useState("");
  const [hashList, setHashList] = useState([]);
  const [matchedEntries, setMatchedEntries] = useState([]);
  const [inputCode, setInputCode] = useState("");
  const [verificationAttempted, setVerificationAttempted] = useState(false);
  const [verifiedByFile, setVerifiedByFile] = useState(false);

  useEffect(() => {
    const fetchHashes = async () => {
      try {
        const snapshot = await getDocs(collectionGroup(db, "issued_certificates"));
        const data = snapshot.docs.map(doc => doc.data());
        setHashList(data);
      } catch (error) {
        console.error("Error fetching certificate data:", error);
      }
    };
    fetchHashes();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setMatchedEntries([]);
    setHash("");
    setVerificationAttempted(false);
    setVerifiedByFile(false);
  };

  const handleVerify = async () => {
    let matches = [];
    setVerifiedByFile(false);

    if (inputCode) {
      matches = hashList.filter((entry) => entry.code === inputCode);
    } else {
      const file = document.querySelector('input[type="file"]').files[0];
      if (!file) {
        alert("Please select a file or enter an alphanumeric code to verify.");
        return;
      }

      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

      const match = hashList.find((entry) => entry.hash === hashHex);
      setHash(hashHex);
      setVerifiedByFile(true);
      if (match) matches.push(match);
    }

    setMatchedEntries(matches);
    setVerificationAttempted(true);
  };

  const renderTable = () => {
    if (matchedEntries.length === 0) return null;

    const sorted = [...matchedEntries].sort((a, b) => a.semester.localeCompare(b.semester));

    const issuer = sorted[0]?.issuer || "";
    const student = sorted[0]?.student || "";

    return (
      <table className="table mt-3">
        <thead>
          <tr>
            <th>Issuer Name</th>
            <td colSpan={sorted.length}>{issuer}</td>
          </tr>
          <tr>
            <th>Student Name</th>
            <td colSpan={sorted.length}>{student}</td>
          </tr>
          <tr>
            <th>Semester</th>
            {sorted.map((entry, index) => (
              <td key={index}>{entry.semester}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>SGPA</th>
            {sorted.map((entry, index) => (
              <td key={index}>{entry.sgpa}</td>
            ))}
          </tr>
          <tr>
            <th>CGPA</th>
            {sorted.map((entry, index) => (
              <td key={index}>{entry.cgpa}</td>
            ))}
          </tr>

          {verifiedByFile && (
            <>
              <tr>
                <th>Hash</th>
                {sorted.map((entry, index) => (
                  <td key={index}>{entry.hash}</td>
                ))}
              </tr>
              <tr>
                <th>Alphanumeric Code</th>
                {sorted.map((entry, index) => (
                  <td key={index}>{entry.code}</td>
                ))}
              </tr>
            </>
          )}
        </tbody>
      </table>
    );
  };

  return (
    <div className="container mt-4">
      <h2 className="hhh">Verifier</h2>
      <br />
      <input type="file" className="form-control mb-3" onChange={handleFileChange} />
      {fileName && <p><strong>File:</strong> {fileName}</p>}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter the alphanumeric code"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
        />
      </div>
      <br />
      <button className="btn btn-primary" onClick={handleVerify}>Verify</button>

      {verificationAttempted && matchedEntries.length > 0 ? (
        <div className="alert alert-success mt-3">
          <strong>User Verified!</strong>
          {renderTable()}
        </div>
      ) : verificationAttempted && (
        <div className="alert alert-danger mt-3">File/User NOT Verified!</div>
      )}
    </div>
  );
};

export default Verifier;

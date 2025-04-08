import { db } from "./firebase";
import { collection, doc, getDocs, getCollections } from "firebase/firestore";

export const fetchAllCertificates = async () => {
  const result = [];

  const usersRef = collection(db, "users");
  const userDocs = await getDocs(usersRef);

  for (const userDoc of userDocs.docs) {
    const uid = userDoc.id;
    const issuerCollections = await getCollections(doc(db, "users", uid));

    for (const issuer of issuerCollections) {
      const issuerName = issuer.id;
      const codeCollections = await getCollections(issuer);

      for (const code of codeCollections) {
        const codeId = code.id;
        const studentCollections = await getCollections(code);

        for (const student of studentCollections) {
          const studentName = student.id;
          const semesterDocs = await getDocs(student);

          for (const cert of semesterDocs.docs) {
            const semester = cert.id;
            const data = cert.data();

            result.push({
              uid,
              issuerName,
              codeId,
              studentName,
              semester,
              ...data,
            });
          }
        }
      }
    }
  }

  return result;
};

import { useEffect, useState } from "react";
import viteLogo from "/vite.svg";
import "../App.css";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import firebaseConfig from "../../db";
import AddService from "./Add";
import { ReadService } from "./Read";
import Trips from "./Trips";
import { v4 as uuidv4 } from "uuid";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const motoCollection = collection(db, "ktm");

function Main() {
  const [moto, setMoto] = useState([]);
  const [error, setError] = useState("");

  const getKtmGen = async () => {
    const docRef = doc(db, "ktm", "1");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("docSnap: ", docSnap.data());
      setMoto(docSnap.data());
    } else {
      setError("Datan haku epäonnistui!");
    }
  };

  useEffect(() => {
    getKtmGen();
  }, []);

  return (
    <>
      {error ? <h3>{error}</h3> : ""}
      
        <>
      
          <h3 style = {{marginLeft:"120px"}}>KTM 1290 SUPERADVENTURE S</h3>

          <div key={moto.id}>
            <table style={{ textAlign: "left", marginLeft: "20%" }}>
              <tbody>
                <tr>
                  <td>Merkki: {moto.make}</td>
                </tr>
                <tr>
                  <td>Malli: {moto.model}</td>
                </tr>
                <tr>
                  <td>Väri: {moto.color}</td>
                </tr>
                <tr>
                  <td>Km: {moto.km}</td>
                </tr>
                <tr>
                  <td>Vuosi: {moto.year}</td>
                </tr>
                <tr>
                  <td>Edellinen huolto: 31-3-2024</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      

    </>
  );
}

export { db };
export default Main;
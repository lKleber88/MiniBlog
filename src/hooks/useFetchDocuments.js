import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { 
    collection, // para definir coleção
    query, // para pegar o dado
    orderBy, // ordem e ação
    onSnapshot, 
    where, // para fazer um filtro

} from "firebase/firestore";

export const useFetchDocuments = (docCollection, search = null, uid = null) => {

    const [documents, setDocuments] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(null)

    // deal with memory leak

    const [cancelled, setCancelled] = useState(false);

    // Fazer uma função que vai ser baseada.
    // Esta sendo o useEffect porque irá mapear algumas coisas
    // que chegam para esse hook
    // será mapeado collection, search, 
    useEffect(() => {

        async function loadData() {
            if (cancelled)
                return;
            

            setLoading(true);

            const collectionRef = collection(db, docCollection)

            try{

                let q;

                if (search) {
                    q = query(
                        collectionRef, 
                        where("tags", "array-contains", search),
                        orderBy("createAt", "desc"))
                } else if (uid) {
                    q = query(
                        collectionRef, 
                        where("uid", "==", uid),
                        orderBy("createAt", "desc"))

                } else {
                    q = query(
                        collectionRef, 
                        orderBy("createAt", "desc"));
                }

                

                onSnapshot(q, (querySnapshot) => {
                    setDocuments(
                        querySnapshot.docs.map((doc) => ({
                            id: doc.id,
                            ...doc.data(),
                        }))
                    );
                });

                
            } catch (error) {
                console.log(error);
                setError(error.message)

                
            }
            setLoading(false)
        
        }
        loadData();

    }, [docCollection, search, uid, cancelled]);

    useEffect(() => {
        return() => setCancelled(true);
    }, [])

    return {documents, loading, error};
}
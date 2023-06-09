import styles from "./CreatePost.module.css"

import { useState } from "react"
import { userInsertDocument } from "../../hooks/useInsertDocument"
import { useNavigate } from "react-router-dom"

import { useAuthValue } from "../../context/AuthContext"



const CreatePost = () => {

  const [title, setTitle]= useState("")
  const [image, setImage]= useState("")
  const [body, setBody]= useState("")
  const [tags, setTags]= useState([])
  const [formError, setFormError]= useState("")
  const [selectedImage, setSelectedImage] = useState(null)

  const {user} = useAuthValue()

  const {insertDocument, response} = userInsertDocument("posts")

  const navigate = useNavigate()

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setSelectedImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError("")
    console.log("handleSubmit")
    console.log(selectedImage)

    // Validate image URL
    try {
      new URL (image)

    }catch (error) {
      setFormError("A imagem precisa ser uma URL!!!!")
    }

    // criar o array de tags

    const tagsArray = tags.split(",").map((tag) => tag.trim().toLowerCase())

    // checar todos os valores
    if (!title || !tags || !body || selectedImage) {
      setFormError ("Por favor, preecha todos os campos!")
    }

    if (formError) return;

    insertDocument({
      title,
      image,
      selectedImage,
      body,
      tags: tagsArray,
      uid: user.uid,
      createBy: user.displayName
    })

    // Redirect Home page
    navigate("/")


  }


  return (
    <div className={styles.create_post}>

        <h2>Criar Post</h2>
        <p>compartilhe  o seu pensamento! </p>
        <form onSubmit={handleSubmit}>
          <label>
            <span>Título:</span>
              <input 
              type="text"
              name="title"
              required
              placeholder="Pense num bom título..."
              value={title}
              onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label>
            <span>URL da imagem:</span>
              <input 
              type="text"
              name="image"
              placeholder="Insira uma imagem"
              value={image}
              onChange={(e) => setImage(e.target.value)} />
          </label>
          <label>
            <span>Carregar imagem:</span>
            <input 
            type="file"
            name="selectedImage"
            placeholder="Ou insira uma imagem aqui."
            onChange={(e) => setSelectedImage(e.target.files[0])} />
          </label>
          <label>
            <span>Conteúdo</span>
              <textarea 
              name="body" 
              id="body" 
              required
              placeholder="Escreva..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              ></textarea>             
          </label>
          <label>
            <span>Tags da imagem:</span>
              <input 
              type="text"
              name="tags"
              required
              placeholder="Insira as tags separadas por vírgulas"
              value={tags}
              onChange={(e) => setTags(e.target.value)} />
          </label>
          <br />
          {!response.loading && <button className="btn">Cadastrar</button>}
          {response.loading && (<button className="btn" disabled>Aguarde...</button>)}
            
          {response.error && <p className="error">{response.error}</p>}
          {formError && <p className="error">{formError}</p>}
        </form>

    </div>
  )
}

export default CreatePost


import styles from "./EditPost.module.css"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuthValue } from "../../context/AuthContext"
import { useFetchDocument } from "../../hooks/useFetchDocument"
import { useUpdateDocument } from "../../hooks/useUpdateDocument"



const EditPost = () => {

  const {id} = useParams()
  const { document: post} = useFetchDocument("posts", id)

  const [title, setTitle]= useState("")
  const [image, setImage]= useState("")
  const [body, setBody]= useState("")
  const [tags, setTags]= useState([])
  const [formError, setFormError]= useState("")

  useEffect(() => {
    if (post) {
    setTitle(post.title)
    setBody(post.body)
    setImage(post.image)

    const textTags = post.tags.join(", ")

    setTags(textTags)
  }

}, [post])

  const {user} = useAuthValue()

  const {updateDocument, response} = useUpdateDocument("posts")

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormError("")

    // Validate image URL
    try {
      new URL (image)

    }catch (error) {
      setFormError("A imagem precisa ser uma URL!!!!")
    }

    // criar o array de tags

    const tagsArray = tags.split(",").map((tag) => tag.trim().toLowerCase())

    // checar todos os valores
    if (!title || !image || !tags || !body) {
      setFormError ("Por favor, preecha todos os campos!")
    }

    if (formError) return;

   const data = {
      title,
      image,
      body,
      tags: tagsArray,
      uid: user.uid,
      createBy: user.displayName
    }

    updateDocument(id, data)

    // Redirect Home page
    navigate("/dashboard")


  }


  return (
    <div className={styles.edit_post}>

        {post && (
          <>
        <h2>Editar post: {post.title}</h2>
        <p>Altere os dados do post como desejar!</p>
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
              required
              placeholder="Insira uma imagem"
              value={image}
              onChange={(e) => setImage(e.target.value)} />
          </label>
          <p className={styles.preview_title}>Preview da imagem atual:</p>
          <img
          className={styles.image_preview}
          src={post.image}
          alt={post.title}
          />
          <label>
            <span>Conteúdo</span>
              <textarea 
              name="body" 
              id="body" 
              cols="20" 
              rows="05" 
              required
              placeholder="Escreva..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              ></textarea>             
          </label>
          <label>
            <span>URL da imagem:</span>
              <input 
              type="text"
              name="tags"
              required
              placeholder="Insira as tags separadas por vírgulas"
              value={tags}
              onChange={(e) => setTags(e.target.value)} />
          </label>
          {!response.loading && <button className="btn">Editar</button>}
          {response.loading && (<button className="btn" disabled>Aguarde...</button>)}
            
          {response.error && <p className="error">{response.error}</p>}
          {formError && <p className="error">{formError}</p>}
        </form>
          
          </>
        )}

    </div>
  )
}

export default EditPost


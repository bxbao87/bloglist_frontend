import { useState } from 'react'
import FormElement from './FormElement'

const BlogForm = ({ createBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const handleCreateBlog = async (event) => {
        event.preventDefault()

        const newBlog = {
            title,
            author,
            url
        }

        let isSuccessful = await createBlog(newBlog)
        if (isSuccessful) {
            setTitle('')
            setAuthor('')
            setUrl('')
        }
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={handleCreateBlog}>
                <FormElement
                    content="title:"
                    name="title"
                    type="text"
                    value={title}
                    onChange={setTitle}
                />
                <FormElement
                    content="author:"
                    name="author"
                    type="text"
                    value={author}
                    onChange={setAuthor}
                />
                <FormElement
                    content="url:"
                    name="title"
                    type="text"
                    value={url}
                    onChange={setUrl}
                />
                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default BlogForm
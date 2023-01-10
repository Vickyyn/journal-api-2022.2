import express from 'express'
import { CategoryModel, EntryModel } from './db'

const app = express()
const port = 4001

app.use(express.json())

app.get('/', (request, response) => response.send({ info: 'Journal API 2023' }))

app.get('/categories', async (req, res) => res.send(await CategoryModel.find()))

app.get('/entries', async (req, res) => res.send(await EntryModel.find()))

app.get('/entries/:id', async (req, res) => {
  try {
    const entry = await EntryModel.findById(req.params.id)
    if (entry) {
      res.send(entry)
    } else {
      res.status(404).send({ error: 'Entry not found' })
    }
  }
  catch (err) {
    res.status(500).send({ error: err.message })
  }
})

// Update
app.put('/entries/:id', async (req, res) => {
  const { category, content } = req.body
  const newEntry = { category, content }
  
  try {
    const entry = await EntryModel.findByIdAndUpdate(req.params.id, newEntry, { returnDocument: 'after' })
    if (entry) {
      res.send(entry)
    } else {
      res.status(404).send({ error: 'Entry not found' })
    }
  }
  catch (err) {
    res.status(500).send({ error: err.message })
  }
})

// Delete
app.delete('/entries/:id', async (req, res) => {
  try {
    const entry = await EntryModel.findByIdAndDelete(req.params.id)
    if (entry) {
      res.sendStatus(204)
    } else {
      res.status(404).send({ error: 'Entry not found' })
    }
  }
  catch (err) {
    res.status(500).send({ error: err.message })
  }
})


app.post('/entries', async (req, res) => {
  try {
    // 1. Create a new entry object with values passed in from the request
    const { category, content } = req.body
    const newEntry = { category, content }
    // 2. Push the new entry to the entries array
    // entries.push(newEntry)
    const insertedEntry = await EntryModel.create(newEntry)
    // 3. Send the new entry with 201 status
    res.status(201).send(insertedEntry)
  }
  catch (err) {
    res.status(500).send({ error: err.message })
  }
})

app.listen(port, () => console.log(`App running at http://localhost:${port}/`))

import React, { useEffect, useState } from 'react'


const App = () => {
  const [students,setStudents] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [age, setAge] = useState('')
  const [course, setCourse] = useState('')
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)


 const fetchStudents=()=>{
  fetch('http://127.0.0.1:8000/api/students/')
  .then(response=>response.json())
  .then(data=>setStudents(data))
  .catch(error=>console.error("Error: ",error))
  .finally(() => setLoading(false))
 }

 useEffect(()=>{
  fetchStudents()
 },[])

 const handlesubmit=(e)=>{
  e.preventDefault()

  const studetData = {
    name,
    email,
    age:Number(age),
    course
  }
  const url = editId?`http://127.0.0.1:8000/api/students/${editId}/`:`http://127.0.0.1:8000/api/students/`
  const method = editId?'PUT':'POST'
  fetch(url,{
    method:method,
    headers:{
      'Content-Type': 'application/json'
    },
    body:JSON.stringify(studetData)
  })
  .then(response=>{
    if(!response.ok){
      throw new error('Student not added check the student details')
    }
    return response.json()
  })
  .then(()=>{
    setMessage(editId ? 'Student updated successfully!' : 'Student added successfully!')
    setName('')
    setEmail('')
    setAge('')
    setCourse('')
    setEditId(null)
    fetchStudents()
  })
  .catch(error=>console.error('Error: ',error))
 }

 const handleUpdate=(student)=>{
  setEditId(student.id)
  setName(student.name)
  setEmail(student.email)
  setAge(String(student.age))
  setCourse(student.course)
 }

 const handleDelete=(id)=>{
  fetch(`http://127.0.0.1:8000/api/students/${id}/delete/`,{
    method:'DELETE'
  })
  .then(response=>{
    if(!response.ok){
      throw new Error("Student not deleted")
    }
    fetchStudents()
  })
  .catch(error=>console.error('Error:',error))
 }

 const filteredStudents = students.filter(student=>
  student.name.toLowerCase().includes(search.toLowerCase())||
  student.email.toLowerCase().includes(search.toLowerCase())||
  student.course.toLowerCase().includes(search.toLowerCase())

 )

  return (
    <>
    <h1>Student Management</h1>
    {message && <p>{message}</p>}
    <h2>Add Student</h2>
    <form onSubmit={handlesubmit}>
      <input type="text" placeholder='Name' value={name} onChange={e=>setName(e.target.value)}/>
      <input type="email" placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)}/>
      <input type="number" placeholder='Age' value={age} onChange={e=>setAge(e.target.value)}/>
      <input type="text" placeholder='course' value={course} onChange={e=>setCourse(e.target.value)}/>
      <button type='submit'>{editId?"Update Student":"Add Student"}</button>
    </form>
    <hr />
    <h2>Student list</h2>
    <input id='search' type="text" placeholder='Search by name,email or course...' value={search} onChange={e=>setSearch(e.target.value)} />
    {
      loading?(<p>Loading Students.....</p>
      ):
    filteredStudents.length > 0 ? (
      filteredStudents.map(student=>(
        <div key={student.id}>
          <p>Name: {student.name}</p>
          <p>Email: {student.email}</p>
          <p>Age: {student.age}</p>
          <p>Course: {student.course}</p>
          <button onClick={()=>handleUpdate(student)}>Update</button>
          <button onClick={()=>handleDelete(student.id)}>Delete</button>
          <hr />
        </div>
      ))
    ):(
      <p>No Student Found</p>
    )
    }
    </>
  )
}

export default App
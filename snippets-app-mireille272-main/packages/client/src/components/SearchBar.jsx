import React, { useState } from "react"

const SearchBar = ({ keywords, setKeywords }) => {
  const [searchInput, setSearchInput] = useState("")
  const handleSearchInputChange = (event) => {
    event.preventDefault()
    setKeywords(event.target.value)
  }
  const handleClearSearchInput = () =>{
    setKeywords("")
  }

  return (
    <form action="/">
      <input
        type="text"
        placeholder="Search"
        onChange={handleSearchInputChange}
        value={keywords}
      />
      <button onClick={handleClearSearchInput}>X</button>
    </form>
  )
}
export default SearchBar
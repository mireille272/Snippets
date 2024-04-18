import React, { useState } from "react"
import { Container } from "react-bootstrap"
import "./AvatarPicker.css"

let imgs = [
  "/bird.svg",
  "/dog.svg",
  "/fox.svg",
  "/frog.svg",
  "/lion.svg",
  "/owl.svg",
  "/tiger.svg",
  "/whale.svg",
]

const AvatarPicker = ({ profileImage, setProfileImage }) => {
  const[selectedAvatar, setSelectedAvatar] = useState("")
  const handleAvatarChange = (event, index) => {
    setProfileImage(event.target.src)
    setSelectedAvatar(index)
  }
  return (
    <Container>
      <h3>set profile Image </h3>
      <div>
        {imgs.map((avatar, index) => (
          <img
            src={avatar}
            className={index=== selectedAvatar ?  "avatarImage selectedImg" : "avatarImage" }
            onClick={(event) => handleAvatarChange(event, index)}
            key={index}
          />
        ))}
      </div>
    </Container>
  )
}

export default AvatarPicker

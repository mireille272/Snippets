import express from "express"
import bcrypt from "bcryptjs"
import { User } from "../models"
import { requireAuth } from "../middleware"

const router = express.Router()

router
  .route("/:username")
  /**
   * Your GET route here
   */

  .get(async (req, res) => {
    const populateQuery = {
      path: "posts",
      populate: { path: "author", select: ["username", "profile_image"] },
    }
    const { username } = req.params
    const user = await User.findOne({ username }).populate(populateQuery)

    res.json(user.toJSON())
  })
  .put(requireAuth, async (req, res) => {
    const { password, confirm_password, current_password} = req.body
    const { username } = req.params


    const user = await User.findOne({ username })

    const checkCurrentPassword = await bcrypt.compare(current_password, user.passwordHash)
    if(checkCurrentPassword === false){
      return res.status(400).json({error:"current password does not match"})
  
    }

    
    if (confirm_password !== password){
      return res.status(401).json({error: "Password does not match"})
    }
    
    if(confirm_password.length < 8|| confirm_password.length> 20){
      return res.status(401).json({error:"password must be between 8 and 20 characters" })
    }
    const hashedpassword = await bcrypt.hash(confirm_password, 12)

    try {
      const userUpdate = await User.findOneAndUpdate(
        {
          username,
        },
        {
          passwordHash: hashedpassword,
        },
        {
          new: true,
        }
      )

      res.json(userUpdate.toJSON())
    } catch (error) {
      res.status(404).end()
    }
  })

router.route("/:username/avatar").put(requireAuth, async (req, res) => {
  const { username } = req.params
  const { profile_image } = req.body

  if (!req.user.username.toLowerCase() === username.toLowerCase()) {
    return res.status(401).json({ error: "unauthorized" })
  }

  const user = await User.findOne({ username })

  if (!user) {
    return res.status(404).json({ error: "user not found" })
  }

  user.profile_image = profile_image
  await user.save()
  res.json(user.toJSON())
})

module.exports = router

import React, { useState, useEffect } from "react"
import { Container, Card, Form, Button, Figure } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import { LoadingSpinner, Post } from "../components"
import { useProvideAuth } from "../hooks/useAuth"
import { useRequireAuth } from "../hooks/useRequireAuth"
import api from "../utils/api.utils.js"
import AvatarPicker from "../components/AvatarPicker/AvatarPicker"
import { toast } from "react-toastify"

const UserDetailPage = ({ profileImage, setProfileImage }) => {
  const { state } = useProvideAuth()
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(true)
  const [validated, setValidated] = useState(false)
  const [open, setOpen] = useState(false)
  const [data, setData] = useState({
    password: "",
    confirm_password: " ",
    current_password: "",
    isSubmitting: false,
    errorMessage: null,
  })
  const [showAvatar, setShowAvatar] = useState(false)

  let navigate = useNavigate()
  let params = useParams()
  const {
    state: { isAuthenticated },
  } = useRequireAuth()

  const {
    user: { uid, username },
  } = state

  useEffect(() => {
    const getUser = async () => {
      try {
        const userResponse = await api.get(`/users/${params.uname}`)
        setUser(userResponse.data)
        setLoading(false)
      } catch (err) {
        console.log(err)
      }
    }
    isAuthenticated && getUser()
  }, [params.uname, isAuthenticated])

  const handleInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    })
  }

  const handleUpdatePassword = async (event) => {
    event.preventDefault()
    event.stopPropagation()
    const form = event.currentTarget
    // handle invalid or empty form
    if (form.checkValidity() === false) {
      setValidated(true)
      return
    }
    setData({
      ...data,
      isSubmitting: true,
      errorMessage: null,
    })
    try {
      // write code to call edit user endpoint 'users/:id'
      const confirmedPassword = await api.put(`/users/${username}`, {
        confirm_password: data.confirm_password,
        current_password: data.current_password,
        password: data.password,
      })
      setData({
        ...data,
        password: "",
        confirm_password: "",
        current_password: "",
        isSubmitting: false,
        errorMessage: confirmedPassword.data.error,
      })
      setLoading(false)
      toast.success("your password was successfully changed")

      console.log(data.password, uid, username)
      setValidated(false)
      // don't forget to update loading state and alert success
    } catch (error) {
      toast.error("Current Password does not match")
      setData({
        ...data,
        isSubmitting: false,
        errorMessage: error.message,
        
      })
    }
  }

  if (!isAuthenticated) {
    return <LoadingSpinner full />
  }

  if (loading) {
    return <LoadingSpinner full />
  }
  const handleAvatarChange = async (event) => {
    const res = await api.put(`/users/${username}/avatar`, {
      profile_image: profileImage,
    })
    // console.log(res.data)
    setUser({ ...user, profile_image: res.data.profile_image })
  }

  return (
    <>
      <Container className="clearfix">
        <Button
          variant="outline-info"
          onClick={() => {
            navigate(-1)
          }}
          style={{ border: "none", color: "#E5E1DF" }}
          className="mt-3 mb-3"
        >
          Go Back
        </Button>
        <Card bg="header" className="text-center">
          <Card.Body>
            <Figure
              className="bg-border-color rounded-circle overflow-hidden my-auto ml-2 p-1"
              style={{
                height: "50px",
                width: "50px",
                backgroundColor: "white",
              }}
            >
              <Figure.Image src={user.profile_image} className="w-100 h-100" />
            </Figure>

            <Button
              className="avatarEditor"
              onClick={() => setShowAvatar(!showAvatar)}
            >
              Edit Avatar
            </Button>

            {showAvatar && (
              <div>
                <AvatarPicker
                  profileImage={profileImage}
                  setProfileImage={setProfileImage}
                />
                <Button className="updateAvatar" onClick={handleAvatarChange}>
                  Update
                </Button>
              </div>
            )}

            <Card.Title>{params.uname}</Card.Title>

            <Card.Title>{user.email}</Card.Title>
            {state.user.username === params.uname && (
              <div
                onClick={() => setOpen(!open)}
                style={{ cursor: "pointer", color: "#BFBFBF" }}
              >
                Edit Password
              </div>
            )}
            {open && (
              <Container animation="false">
                <div className="row justify-content-center p-4">
                  <div className="col text-center">
                    <Form
                      noValidate
                      validated={validated}
                      onSubmit={handleUpdatePassword}
                    >
                      <Form.Label>Current Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="current_password"
                        required
                        value={data.current_password}
                        onChange={handleInputChange}
                      />
                      <Form.Group>
                        <Form.Label htmlFor="password">New Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          required
                          value={data.password}
                          onChange={handleInputChange}
                        />
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="confirm_password"
                          required
                          value={data.confirm_password}
                          onChange={handleInputChange}
                        />

                        <Form.Control.Feedback type="invalid">
                          New Password is required
                        </Form.Control.Feedback>
                        <Form.Text id="passwordHelpBlock" muted>
                          Must be 8-20 characters long.
                        </Form.Text>
                      </Form.Group>

                      {data.errorMessage && (
                        <span className="form-error">{data.errorMessage}</span>
                      )}
                      <Button type="submit" disabled={data.isSubmitting}>
                        {data.isSubmitting ? <LoadingSpinner /> : "Update"}
                      </Button>
                    </Form>
                  </div>
                </div>
              </Container>
            )}
          </Card.Body>
        </Card>
      </Container>
      <Container className="pt-3 pb-3">
        {user.posts.length !== 0 ? (
          user.posts.map((post) => (
            <Post key={post._id} post={post} userDetail />
          ))
        ) : (
          <div
            style={{
              marginTop: "75px",
              textAlign: "center",
            }}
          >
            No User Posts
          </div>
        )}
      </Container>
    </>
  )
}

export default UserDetailPage

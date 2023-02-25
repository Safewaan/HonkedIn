import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
//import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"

export default function UpdateCredentials(loading) {
    //const [loading, setLoading] = useState(false)
    const history = useHistory()

    async function redirectUpdateCredentials() {
        history.push("./update-credentials");
    }
    

    async function redirectUpdateStatus() {
        history.push("./update-status");
    }

    React.useEffect(() => {
        loading();
    }, [loading]);

    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">User Settings</h2>
                    <Form>
                        <Button disabled={loading} onClick={redirectUpdateCredentials} className="w-100" type="submit">
                            Update Credentials
                        </Button>
                        <div style={{ margin: '20px' }}></div> {/* add a 10px gap */}
                        <Button disabled={loading} onClick={redirectUpdateStatus} className="w-100" type="submit">
                            Update Account Status
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </>
    )
}

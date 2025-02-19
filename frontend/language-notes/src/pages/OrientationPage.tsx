import { fetchAllBooks } from "@/api/books"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { useContext, useEffect, useState } from "react"
import { SupabaseContext } from ".."
import { hasSubscribers } from "diagnostics_channel"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Link } from "react-router"

function OrientationPage() {
    // TODO: React query to set loading state
    const [hasBooks, setHasBooks] = useState("loading")
    const [books, setBooks] = useState<Book[]>([])
    const [selectedBook, setSelectedBook] = useState("")
    const supabase = useContext(SupabaseContext)

    useEffect(() => {
        async function findBookData() {
            const {data, error} = await supabase.auth.getSession()
        
            if (error || !data.session) {
                throw new Error("Error fetching session: " + error.message)
            }
            const token = data?.session?.access_token || ""
            const books = await fetchAllBooks(token)
           
            if (books.length === 0) {
                setHasBooks("false")
            } else {
                setBooks(books)
                setHasBooks("true")
            }
        }

        findBookData()
    }, [])


    if (hasBooks == "loading") {
        return (
            <div className="flex items-center justify-center min-h-screen"></div>
        )
    } else if (hasBooks == "false") {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Card className="w-1/4 h-1/4 text-center">
                    <CardHeader>
                        <CardTitle>Getting started with Language Notes</CardTitle>
                        {/* <CardDescription>
                            
                        </CardDescription> */}
                    </CardHeader>
                    <CardContent className="flex justify-center">
                    <p>
                        Welcome to Language Notes pilot
    
                        We hope to become a staple tool for 
                        your language learning journey!
    
                        If things break please let me know at
                        poopooweewee@gmail.com.
                    </p>
                    </CardContent>
                    <CardFooter>
                        <Button>
                            <Link to={`/book/create`}>Continue</Link>
                        </Button>
                    </CardFooter>
                </Card>
                
            </div>
        )
    } 
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-1/4 h-1/4 text-center">
                <CardHeader>
                    <CardTitle>Getting started with Language Notes</CardTitle>
                    {/* <CardDescription>
                        
                    </CardDescription> */}
                </CardHeader>
                <CardContent className="flex justify-center">
                    <Select onValueChange={(val) => setSelectedBook(val)} defaultValue={books[0].name}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a book" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                books.map(book => {
                                    return (
                                        <SelectItem key={book.id.toString()} value={book.id.toString()}>{book.name}</SelectItem>)
                                })
                            }
                        </SelectContent>
                    </Select>
                </CardContent>
                <CardFooter>
                    {selectedBook ? (
                        <Button>
                            <Link to={`/book/${selectedBook}`}>Select</Link>
                        </Button>
                    ) : (
                        <Button disabled>Select</Button>
                    )}
                </CardFooter>
            </Card>       
        </div>
    )
}

export default OrientationPage
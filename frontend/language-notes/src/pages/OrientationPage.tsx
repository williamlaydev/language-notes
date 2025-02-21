import { fetchAllBooks } from "@/api/books"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { useContext, useEffect, useState } from "react"
import { SupabaseContext } from ".."
import { hasSubscribers } from "diagnostics_channel"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router"
import useCurrentBookStore from "@/stores/useCurrentBookStore"

function OrientationPage() {
    // TODO: React query to set loading state
    const [hasBooks, setHasBooks] = useState("loading")
    const [books, setBooks] = useState<Book[]>([])
    const [selectedBook, setSelectedBook] = useState("")
    const supabase = useContext(SupabaseContext)
    const currentBookStore = useCurrentBookStore()
    const navigate = useNavigate()
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


    const handleSelectBook = () => {
        const bookData = books.find(book => book.id === parseInt(selectedBook)) || null

        if (!bookData) {
            throw new Error("Book is wrong")
        }

        currentBookStore.setCurrentBookData(bookData)

        navigate(`/book/${bookData.id}`)
    }

    if (hasBooks == "loading") {
        return (
            <div className="flex items-center justify-center min-h-screen"></div>
        )
    } else if (hasBooks == "false") {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Card className="w-full max-w-md text-center shadow-lg">
                    <CardHeader>
                        <CardTitle>Getting started with Language Notes</CardTitle>
                        {/* <CardDescription>
                            
                        </CardDescription> */}
                    </CardHeader>
                    <CardContent className="flex flex-col items-center text-gray-600 space-y-4">
                        <p className="text-sm leading-relaxed">
                            Welcome to the <span className="font-semibold">Language Notes</span> pilot! 🎉
                        </p>
                        <p className="text-sm leading-relaxed">
                            We hope to become a staple tool in your language learning journey.
                        </p>
                        <p className="text-sm">
                            If anything breaks, please let me know at 
                            <span className="block font-medium text-blue-600"> poopooweewee@gmail.com</span>
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-4/5">
                            <Link to={`/book/create`} className="w-full block">Continue</Link>
                        </Button>
                    </CardFooter>
                </Card>
                
            </div>
        )
    } 
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md text-center p-6">
                <CardHeader>
                    <CardTitle>Select which book to access</CardTitle>
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
                <CardFooter className="flex justify-centre w-full space-x-2">
                    <Button className="w-1/2" disabled={!selectedBook} onClick={handleSelectBook}>
                        Select
                    </Button>
                </CardFooter>
            </Card>       
        </div>
    )
}

export default OrientationPage
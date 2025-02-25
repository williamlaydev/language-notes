import { createBook } from "@/api/books"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useContext, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { SupabaseContext } from ".."
import { BookLanguage } from "@/enums"
import { useNavigate } from "react-router"
import { createNewPage } from "@/api/page"
import { createNewSet } from "@/api/set"

const languageList = [
    BookLanguage.Chinese,
    BookLanguage.Japanese,
    BookLanguage.Korean
]

function BookCreationPage() {
    const supabase = useContext(SupabaseContext)
    const navigate = useNavigate()

    const formSchema = z.object({
        name: z.string()
            .min(1, "Name must be at least 1 character")
            .max(12, "Name must be less than 12 characters"),
        language: z.enum([BookLanguage.Chinese, BookLanguage.Japanese, BookLanguage.Korean]),
        pageName: z.string()
            .min(1, "Name must be at least 1 character")
            .max(12, "Name must be less than 12 characters"),
        setName: z.string()
            .min(1, "Name must be at least 1 character")
            .max(12, "Name must be less than 12 characters"),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            language: undefined,
            pageName: "",
            setName: ""
        }
    })

    async function handleCreateBook(values: z.infer<typeof formSchema>) {
        const {data, error} = await supabase.auth.getSession()

        if (error || !data.session) {
            throw new Error("Error fetching session: " + error.message)
        }
        const token = data?.session?.access_token || ""

        const newBookId = await createBook(values, token)

        if (newBookId) {
            const newPageId = await createNewPage(parseInt(newBookId), values.pageName, token)

            if (newPageId) {
                await createNewSet(parseInt(newPageId), values.setName, token)
            }
        }
        
        navigate(`/book/${newBookId}`)
    }


    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-1/4 h-1/4 text-center">
                <CardHeader>
                    <CardTitle>Notebook creation</CardTitle>
                    <CardDescription>
                        Create a notebook for the language you are learning.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex text-left">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleCreateBook)} className="space-y-2 w-full">
                            <FormField
                                control={form.control}
                                name="language"
                                render={({ field }) => (
                                    <FormItem> 
                                        <FormLabel className="text-xs">Select a language:</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {
                                                        languageList.map(language => {
                                                            return (<SelectItem key={language} value={language.toString()}>{language}</SelectItem>)
                                                        })
                                                    }
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem> 
                                        <FormLabel className="text-xs">Enter the name of the book:</FormLabel>
                                        <FormControl>
                                            <Input autoComplete="off" placeholder="" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="pageName"
                                render={({ field }) => (
                                    <FormItem> 
                                        <FormLabel className="text-xs">Create your first page:</FormLabel>
                                        <FormControl>
                                            <Input autoComplete="off" placeholder="" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="setName"
                                render={({ field }) => (
                                    <FormItem> 
                                        <FormLabel className="text-xs">Create your first set:</FormLabel>
                                        <FormControl>
                                            <Input autoComplete="off" placeholder="" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button 
                                type="submit" 
                                disabled={!form.watch("language") || !form.watch("name") || !form.watch("pageName") || !form.watch("setName")}
                                className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Create
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                {/* <CardFooter>
                    <p>Card Footer</p>
                </CardFooter> */}
            </Card>
        </div>
    )
}

export default BookCreationPage
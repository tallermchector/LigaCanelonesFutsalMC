
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Team } from "@/types"

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

const editClubSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  logoUrl: z.string().url("Debe ser una URL válida para el logo"),
  slug: z.string().min(3, "El slug debe tener al menos 3 caracteres"),
});

type EditClubFormValues = z.infer<typeof editClubSchema>

interface EditClubSheetProps {
    team: Team;
    isOpen: boolean;
    onClose: () => void;
}

export function EditClubSheet({ team, isOpen, onClose }: EditClubSheetProps) {
    const { toast } = useToast()
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<EditClubFormValues>({
        resolver: zodResolver(editClubSchema),
        defaultValues: {
            name: team.name,
            logoUrl: team.logoUrl || '',
            slug: team.slug,
        },
    });
    
    useEffect(() => {
        if (isOpen) {
            form.reset({
                name: team.name,
                logoUrl: team.logoUrl || '',
                slug: team.slug,
            })
        }
    }, [isOpen, team, form]);


    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        form.setValue('name', name);
        form.setValue('slug', slugify(name));
    }
    
    async function onSubmit(values: EditClubFormValues) {
        setIsSubmitting(true)
        try {
            // Aquí iría la llamada a la server action para editar el club
            console.log(values);
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast({
                title: "Club Actualizado (Simulación)",
                description: `El club ${values.name} ha sido actualizado exitosamente.`,
            })
            onClose();
            router.refresh()
        } catch (error) {
             toast({
                variant: "destructive",
                title: "Error al actualizar club",
                description: "No se pudo actualizar el club. Por favor, intente de nuevo.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Editar Club: {team.name}</SheetTitle>
                    <SheetDescription>
                        Realiza cambios en la información del club. Haz clic en guardar cuando termines.
                    </SheetDescription>
                </SheetHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre del Club</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej: Futsaleros FC" {...field} onChange={handleNameChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slug</FormLabel>
                                    <FormControl>
                                        <Input placeholder="ej: futsaleros-fc" {...field} />
                                    </FormControl>
                                     <FormDescription>
                                        Se utiliza para la URL. Se genera automáticamente.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="logoUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>URL del Logo</FormLabel>
                                     <FormControl>
                                        <Input placeholder="https://example.com/logo.png" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <SheetFooter>
                            <SheetClose asChild>
                                <Button type="button" variant="outline">Cancelar</Button>
                            </SheetClose>
                             <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                            </Button>
                        </SheetFooter>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    )
}

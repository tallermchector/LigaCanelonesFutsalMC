
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Form,
  FormControl,
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
import type { Player } from "@/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAllTeams } from "@/actions/team-actions"


const editPlayerSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  number: z.coerce.number().min(0, "El número no puede ser negativo"),
  position: z.enum(["GOLERO", "DEFENSA", "ALA", "PIVOT"]),
  teamId: z.string().min(1, "Debe seleccionar un equipo"),
  avatarUrl: z.string().optional(),
});


type EditPlayerFormValues = z.infer<typeof editPlayerSchema>

interface EditPlayerSheetProps {
    player: Player;
    isOpen: boolean;
    onClose: () => void;
}

export function EditPlayerSheet({ player, isOpen, onClose }: EditPlayerSheetProps) {
    const { toast } = useToast()
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [teams, setTeams] = useState<any[]>([]);

     useEffect(() => {
        getAllTeams().then(setTeams);
    }, []);

    const form = useForm<EditPlayerFormValues>({
        resolver: zodResolver(editPlayerSchema),
        defaultValues: {
            name: player.name,
            number: player.number,
            position: player.position,
            teamId: String(player.teamId),
            avatarUrl: player.avatarUrl || '',
        },
    });
    
    useEffect(() => {
        if (isOpen) {
            form.reset({
                name: player.name,
                number: player.number,
                position: player.position,
                teamId: String(player.teamId),
                avatarUrl: player.avatarUrl || '',
            })
        }
    }, [isOpen, player, form]);

    async function onSubmit(values: EditPlayerFormValues) {
        setIsSubmitting(true)
        try {
            // Aquí iría la llamada a la server action para editar el jugador
            console.log(values);
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast({
                title: "Jugador Actualizado (Simulación)",
                description: `El jugador ${values.name} ha sido actualizado exitosamente.`,
            })
            onClose();
            router.refresh()
        } catch (error) {
             toast({
                variant: "destructive",
                title: "Error al actualizar el jugador",
                description: "No se pudo actualizar el jugador. Por favor, intente de nuevo.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Editar Jugador: {player.name}</SheetTitle>
                    <SheetDescription>
                        Realiza cambios en la información del jugador. Haz clic en guardar cuando termines.
                    </SheetDescription>
                </SheetHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                       <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre del Jugador</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej: Juan Pérez" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="teamId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Equipo</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Seleccione un equipo" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {teams.map(team => (
                                                <SelectItem key={team.id} value={String(team.id)}>{team.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="number"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Número de Camiseta</FormLabel>
                                     <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="position"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Posición</FormLabel>
                                     <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Seleccione una posición" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="GOLERO">Golero</SelectItem>
                                            <SelectItem value="DEFENSA">Defensa</SelectItem>
                                            <SelectItem value="ALA">Ala</SelectItem>
                                            <SelectItem value="PIVOT">Pivot</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="avatarUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>URL del Avatar</FormLabel>
                                     <FormControl>
                                        <Input placeholder="/avatar/1.png" {...field} />
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

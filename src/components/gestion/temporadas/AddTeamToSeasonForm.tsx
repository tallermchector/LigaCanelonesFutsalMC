
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Season, Team } from "@prisma/client"
import { addTeamToSeason } from "@/actions/season-actions"

const addTeamToSeasonSchema = z.object({
  seasonId: z.string().min(1, "Debe seleccionar una temporada"),
  teamId: z.string().min(1, "Debe seleccionar un equipo"),
});

type AddTeamToSeasonFormValues = z.infer<typeof addTeamToSeasonSchema>

interface AddTeamToSeasonFormProps {
    seasons: Season[]
    teams: Team[]
}

export function AddTeamToSeasonForm({ seasons, teams }: AddTeamToSeasonFormProps) {
    const { toast } = useToast()
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<AddTeamToSeasonFormValues>({
        resolver: zodResolver(addTeamToSeasonSchema),
        defaultValues: {
            seasonId: '',
            teamId: '',
        },
    });
    
    async function onSubmit(values: AddTeamToSeasonFormValues) {
        setIsSubmitting(true)
        try {
            await addTeamToSeason(parseInt(values.seasonId), parseInt(values.teamId));
            
            toast({
                title: "Equipo Añadido",
                description: "El equipo ha sido añadido a la temporada exitosamente.",
            })
            form.reset()
            router.refresh()
        } catch (error) {
             const errorMessage = error instanceof Error ? error.message : "No se pudo añadir el equipo. Por favor, intente de nuevo.";
             toast({
                variant: "destructive",
                title: "Error al añadir equipo",
                description: errorMessage,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card>
            <CardContent className="pt-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="seasonId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Temporada</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Seleccione una temporada" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {seasons.map(season => (
                                                <SelectItem key={season.id} value={String(season.id)}>{season.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
                        
                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting ? 'Añadiendo...' : 'Añadir Equipo'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

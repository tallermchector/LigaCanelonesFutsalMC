"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { summarizeFutsalNews } from "@/ai/flows/summarize-futsal-news";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  url: z.string().url({ message: "Por favor, introduce una URL válida." }),
});

export function NewsSummary() {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSummary("");

    try {
      const result = await summarizeFutsalNews({ url: values.url });
      if (result.summary) {
        setSummary(result.summary);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo generar el resumen. Inténtalo de nuevo.",
        });
      }
    } catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al procesar la solicitud. Por favor, asegúrate que la URL es un artículo de noticias accesible.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section id="news-summary" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">Resumen de Noticias con IA</CardTitle>
              <CardDescription className="text-center pt-2">
                ¿No tienes tiempo de leer un artículo completo? Pega la URL a continuación y obtén un resumen al instante.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL del Artículo</FormLabel>
                        <FormControl>
                          <Input placeholder="https://ejemplo.com/noticia-de-futsal" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading} variant="accent">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generando...
                      </>
                    ) : (
                      "Generar Resumen"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            {summary && (
              <CardFooter>
                <div className="w-full space-y-4 rounded-lg border bg-secondary/50 p-4">
                  <h3 className="text-xl font-semibold text-secondary-foreground">Resumen:</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{summary}</p>
                </div>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
}

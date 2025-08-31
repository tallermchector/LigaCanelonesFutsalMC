"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  summarizeFutsalNews,
  type SummarizeFutsalNewsOutput,
} from "@/ai/flows/summarize-futsal-news";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Newspaper, Sparkles } from "lucide-react";

const FormSchema = z.object({
  url: z.string().url({ message: "Por favor, introduce una URL válida." }),
});

export function NewsSummary() {
  const [summary, setSummary] = useState<SummarizeFutsalNewsOutput | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      url: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setSummary(null);
    try {
      const result = await summarizeFutsalNews({ url: data.url });
      setSummary(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error al resumir",
        description:
          "No se pudo generar el resumen de la noticia. Por favor, intenta de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section id="noticias" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-secondary-foreground">
              Resumen de Noticias
            </div>
            <h2 className="font-headline text-3xl font-bold tracking-tighter text-primary sm:text-5xl">
              Resúmenes con IA
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Pega la URL de una noticia de futsal y obtén un resumen al
              instante gracias a la magia de la inteligencia artificial.
            </p>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="h-6 w-6" />
                <span>Generador de Resúmenes</span>
              </CardTitle>
              <CardDescription>
                Introduce la URL del artículo que quieres resumir.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL de la Noticia</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://ejemplo.com/noticia-de-futsal"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-accent hover:bg-accent/90"
                  >
                    {isLoading ? "Generando..." : "Generar Resumen"}
                    {!isLoading && <Sparkles className="ml-2 h-4 w-4" />}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {(isLoading || summary) && (
            <Card className="mt-8 animate-fade-in">
              <CardHeader>
                <CardTitle>Resumen Generado</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ) : (
                  summary && (
                    <p className="text-foreground/80">{summary.summary}</p>
                  )
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}

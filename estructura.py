import os
import json

def obtener_estructura_directorio(ruta_raiz):
    """
    Recorre recursivamente un directorio y devuelve una estructura anidada
    de diccionarios que representan los directorios y archivos, incluyendo
    el contenido de los archivos de texto.
    """
    estructura_directorio = []
    # Nombres de directorios a ignorar
    directorios_ignorados = {'node_modules', '__pycache__', '.next', '.git'}
    # Extensiones de archivo a ignorar (comunes para binarios o assets)
    extensiones_ignoradas = {'.ico', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.lock'}

    for nombre_item in os.listdir(ruta_raiz):
        # Ignorar directorios y archivos ocultos (que empiezan con '.')
        if nombre_item.startswith('.'):
            continue
        
        ruta_completa = os.path.join(ruta_raiz, nombre_item)

        if os.path.isdir(ruta_completa):
            # Ignorar directorios específicos
            if nombre_item in directorios_ignorados:
                continue
            # Llamada recursiva para subdirectorios
            estructura_directorio.append({
                "nombre": nombre_item,
                "tipo": "directorio",
                "hijos": obtener_estructura_directorio(ruta_completa)
            })
        else:
            # Es un archivo
            _, extension = os.path.splitext(nombre_item)
            # Ignorar archivos con extensiones específicas
            if extension in extensiones_ignoradas:
                continue

            contenido = None
            try:
                # Intentar leer el archivo como texto
                with open(ruta_completa, 'r', encoding='utf-8') as f:
                    contenido = f.read()
            except Exception:
                # Si falla, es probable que sea un archivo binario
                contenido = "Error: No se pudo leer el contenido (posiblemente archivo binario)."
            
            estructura_directorio.append({
                "nombre": nombre_item,
                "tipo": "archivo",
                "contenido": contenido
            })
            
    return estructura_directorio

def main():
    """
    Función principal que inicia el proceso y guarda el resultado en un JSON.
    """
    directorio_src = 'src'
    archivo_salida = 'estructura_y_contenido.json'

    if not os.path.isdir(directorio_src):
        print(f"Error: El directorio '{directorio_src}' no fue encontrado.")
        print("Por favor, ejecuta este script desde la raíz de tu proyecto.")
        return

    print(f"Analizando la estructura del directorio '{directorio_src}'...")
    
    # Obtener la estructura completa
    estructura_completa = {
        "nombre": directorio_src,
        "tipo": "directorio",
        "hijos": obtener_estructura_directorio(directorio_src)
    }

    print(f"Escribiendo la estructura en el archivo '{archivo_salida}'...")
    
    try:
        # Escribir el diccionario en un archivo JSON con formato legible
        with open(archivo_salida, 'w', encoding='utf-8') as f:
            json.dump(estructura_completa, f, ensure_ascii=False, indent=4)
        print("¡Proceso completado exitosamente!")
    except Exception as e:
        print(f"Ocurrió un error al escribir el archivo JSON: {e}")

if __name__ == '__main__':
    # Ejecutar la función principal cuando se corre el script
    main()
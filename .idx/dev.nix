# .idx/dev.nix
# Configuración del entorno de desarrollo de Project IDX

{pkgs, ...}:
{
  # Definición de paquetes del sistema disponibles en el entorno
  packages = [
    pkgs.bun # Runtime de JavaScript para ejecutar scripts y desarrollo
    pkgs.nodejs # Incluye node, npm y npx, necesarios para algunas dependencias y scripts
    pkgs.postgresql # Base de datos del proyecto
    pkgs.git # Control de versiones
    pkgs.python3 # Intérprete de Python 3
    pkgs.openssl
  ];

  # Configuración específica para el editor VS Code
  idx = {
    # Extensiones de VS Code a instalar automáticamente
    # Listado ampliado para soportar el stack tecnológico del proyecto
    extensions = [
            "Google.validation-agent-extension"
      "google.gemini-cli-vscode-ide-companion"
      "ms-python.debugpy"
      "ms-python.python"
      "google.geminicodeassist"
      "mblode.pretty-formatter" # Formateador genérico, puede ser complementado o reemplazado por Prettier
      "dbaeumer.vscode-eslint" # Integración de ESLint para análisis de código estático
      "esbenp.prettier-vscode" # Formateador de código universal para consistencia
      "bradlc.vscode-tailwindcss" # Soporte mejorado para Tailwind CSS
      "prisma.prisma" # Resaltado de sintaxis y herramientas para Prisma
      "vscode-icons-team.vscode-icons" # Iconos de archivo mejorados para una navegación visual más fácil
      "bungcip.better-toml"
      "YoavBls.pretty-ts-errors"
    ];
    # Configuración del espacio de trabajo
    workspace = {
      # Archivos que se abren automáticamente al crear o reiniciar el espacio de trabajo
      onCreate = {
        default.openFiles = [
        ];
      };
    };
    # Habilitar y personalizar las vistas previas de la aplicación
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["bun" "run" "dev" "--" "--port" "$PORT" "--hostname" "0.0.0.0"];
          manager = "web";
        };
      };
    };
  };
}

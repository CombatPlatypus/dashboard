/**
 * Elementos utilizados pelo
 * visualizador de imagens.
 */
function getImageViewerElements() {

    const imageViewer =
        document.getElementById(
            "imageViewer"
        );

    const viewerImage =
        document.getElementById(
            "viewerImage"
        );

    const closeImageViewerButton =
        document.getElementById(
            "closeImageViewer"
        );

    const imageViewerLoading =
        document.getElementById(
            "imageViewerLoading"
        );

    if (
        !imageViewer ||
        !viewerImage ||
        !imageViewerLoading ||
        !closeImageViewerButton
    ) {

        console.error(
            "Elementos do visualizador de imagens não foram encontrados.",
            {
                imageViewer,
                viewerImage,
                imageViewerLoading,
                closeImageViewerButton
            }
        );

        return null;

    }

    return {
        imageViewer,
        viewerImage,
        imageViewerLoading,
        closeImageViewerButton
    };

}


/**
 * Abre o visualizador com
 * a imagem informada.
 */
export function openImageViewer(
    imageUrl,
    imageName = "Imagem"
) {

    if (!imageUrl) {

        console.error(
            "URL da imagem não informada."
        );

        return;

    }

    const viewerElements =
        getImageViewerElements();

    if (!viewerElements) {

        return;

    }

    const {
        imageViewer,
        viewerImage,
        imageViewerLoading
    } = viewerElements;

    imageViewerLoading.hidden =
        false;

    viewerImage.hidden =
        true;

    viewerImage.alt =
        imageName;

    imageViewer.hidden =
        false;

    imageViewer.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "image-viewer-open"
    );

    /*
     * Definido por último para iniciar
     * o carregamento somente após o
     * viewer estar preparado.
     */
    viewerImage.src =
        imageUrl;

}


/**
 * Fecha o visualizador e limpa
 * a imagem carregada.
 */
export function closeImageViewer() {

    const viewerElements =
        getImageViewerElements();

    if (!viewerElements) {

        return;

    }

    const {
        imageViewer,
        viewerImage,
        imageViewerLoading
    } = viewerElements;

    imageViewer.hidden =
        true;

    imageViewer.setAttribute(
        "aria-hidden",
        "true"
    );

    viewerImage.hidden =
        true;

    /*
     * Limpa a URL depois de esconder
     * a imagem para evitar o ícone quebrado.
     */
    viewerImage.removeAttribute(
        "src"
    );

    viewerImage.alt =
        "";

    imageViewerLoading.hidden =
        false;

    document.body.classList.remove(
        "image-viewer-open"
    );

}


/**
 * Configura os eventos usados
 * pelo visualizador de imagens.
 */
export function initializeImageViewer() {

    const viewerElements =
        getImageViewerElements();

    if (!viewerElements) {

        return;

    }

    const {
        imageViewer,
        viewerImage,
        imageViewerLoading,
        closeImageViewerButton
    } = viewerElements;

    closeImageViewerButton.addEventListener(
        "click",
        closeImageViewer
    );

    imageViewer.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                imageViewer
            ) {

                

            }

        }
    );

    viewerImage.addEventListener(
        "load",
        () => {

            imageViewerLoading.hidden =
                true;

            viewerImage.hidden =
                false;

        }
    );

    viewerImage.addEventListener(
        "error",
        () => {

            imageViewerLoading.hidden =
                true;

            console.error(
                "Não foi possível carregar a imagem no viewer:",
                viewerImage.src
            );

            viewerImage.hidden =
                true;

        }
    );

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                !imageViewer.hidden
            ) {

                
            }

        }
    );

}

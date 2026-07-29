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
            "Elementos do visualizador de imagens não foram encontrados."
        );

        return null;

    }

    return {
        imageViewer,
        viewerImage,
        closeImageViewerButton
    };

}


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

    viewerImage.src =
        "";

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
 * para fechar o visualizador.
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

                closeImageViewer();

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

            closeImageViewer();

        }
    );


    viewerImage.addEventListener(
        "error",
        () => {

            console.error(
                "Não foi possível carregar a imagem no viewer:",
                viewerImage.src
            );

            closeImageViewer();

        }
    );

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                !imageViewer.hidden
            ) {

                closeImageViewer();

            }

        }
    );

}

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

    if (
        !imageViewer ||
        !viewerImage ||
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


/**
 * Abre o visualizador com a imagem informada.
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
        viewerImage
    } = viewerElements;

    viewerImage.src =
        imageUrl;

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
        viewerImage
    } = viewerElements;

    imageViewer.hidden =
        true;

    imageViewer.setAttribute(
        "aria-hidden",
        "true"
    );

    viewerImage.src =
        "";

    viewerImage.alt =
        "";

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
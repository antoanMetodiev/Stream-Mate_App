import styles from "./Pagination.module.css";

interface PaginationProps {
    totalPages: number,
    currentPaginationPage: number,
    setCurrentPaginationPage: React.Dispatch<React.SetStateAction<number>>;
};

export const Pagination = ({
    totalPages,
    currentPaginationPage,
    setCurrentPaginationPage,
}: PaginationProps) => {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    console.log(currentPaginationPage);
    return (
        <div className={styles.paginationContainer}>
            {/* Бутон за предишна страница */}
            <button
                onClick={() => () => {
                    debugger;
                    localStorage.removeItem("LAST_CINEMA_RECORDS");
                    // localStorage.setItem("LAST_CURRENT_PAGE", JSON.stringify(currentPaginationPage - 1));
                    setCurrentPaginationPage(currentPaginationPage - 1);
                    // Скролира страницата до най-горе
                   
                }}
                disabled={currentPaginationPage === 1}
                className={`${styles.pageButton} ${currentPaginationPage === 1 ? styles.disabled : ""}`}
            >
                ◀
            </button>

            {/* Динамични номера на страниците */}
            {pageNumbers.map((num) => (
                <button
                    key={num}
                    onClick={() => {
                        localStorage.removeItem("LAST_CINEMA_RECORDS");
                        // localStorage.setItem("LAST_CURRENT_PAGE", JSON.stringify(num));
                        setCurrentPaginationPage(num);
                    }}
                    className={`${styles.pageButton} ${num === currentPaginationPage ? styles.active : ""}`}
                >
                    {num}
                </button>
            ))}

            {/* Бутон за следваща страница */}
            <button
                onClick={() => {
                    localStorage.removeItem("LAST_CINEMA_RECORDS");
                    // localStorage.setItem("LAST_CURRENT_PAGE", JSON.stringify(currentPaginationPage - 1));
                    setCurrentPaginationPage(currentPaginationPage + 1);
                }}
                disabled={currentPaginationPage === totalPages}
                className={`${styles.pageButton} ${currentPaginationPage === totalPages ? styles.disabled : ""}`}
            >
                ▶
            </button>
        </div>
    );
};


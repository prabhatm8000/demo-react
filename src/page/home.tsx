import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { OverlayPanel } from "primereact/overlaypanel";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { getArtworks } from "../api/apiClient";
import type {
    Artwork,
    ArtworkResponse,
    PaginationType,
} from "../api/responseTypes";
import DownArrow from "../assets/down-arrow.svg";
import Pagination from "../components/Pagination";

export default function Home() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectInputNumber, setSelectInputNumber] = useState<number>(0);

    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [pagination, setPagination] = useState<PaginationType | null>(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(
        Number(searchParams.get("page") || "1")
    );
    const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);

    const op = useRef<OverlayPanel>(null);

    const onPageChange = (page: number) => {
        setCurrentPage(page);
        setSearchParams({ page: String(page) });
    };

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        let remaining = selectInputNumber;

        if (pagination && remaining > pagination.limit) {
            const allSelectedArtworks: Artwork[] = artworks.slice(
                0,
                pagination.limit
            );
            let nextPage = currentPage + 1;

            remaining -= pagination.limit

            while (remaining > 0 && nextPage <= pagination.total_pages) {
                await getArtworks(nextPage)
                    .then((res) => res.json())
                    .then((data: ArtworkResponse) => {
                        const artworksToAdd = data.data.slice(0, remaining);
                        allSelectedArtworks.push(...artworksToAdd);
                        remaining -= artworksToAdd.length;
                    })
                    .catch((err) => {
                        console.log(err);
                        remaining = 0; // exit loop on error
                    });

                nextPage += 1;
            }

            setSelectedArtworks(p => [...p, ...allSelectedArtworks]);
        } else {
            setSelectedArtworks(artworks.slice(0, selectInputNumber));
        }
    };

    useEffect(() => {
        if (currentPage === 0) return;

        setLoading(true);
        getArtworks(currentPage)
            .then((res) => res.json())
            .then((data: ArtworkResponse) => {
                setArtworks(data.data);
                setPagination(data.pagination);
            })
            .catch((err) => console.log(err))
            .finally(() => setLoading(false));
    }, [currentPage]);

    return (
        <div className="card p-4 min-h-screen">
            <Button type="button" onClick={(e) => op?.current?.toggle(e)}>
                <img
                    className="size-6"
                    width={30}
                    height={30}
                    src={DownArrow}
                />
            </Button>
            <OverlayPanel
                ref={op}
                className="border border-black rounded-lg p-0"
            >
                <form className="flex flex-col gap-4" onSubmit={onSubmit}>
                    <input
                        value={selectInputNumber || ""}
                        onChange={(e) =>
                            setSelectInputNumber(Number(e.target.value) || 0)
                        }
                        className="border border-black px-2 py-1 w-fit rounded-lg"
                    />
                    <button
                        type="submit"
                        className="border border-black px-2 py-1 w-fit rounded-lg"
                        onClick={() => op?.current?.hide()}
                    >
                        Submit
                    </button>
                </form>
            </OverlayPanel>
            <DataTable
                className="min-h-screen"
                selectionMode={"multiple"}
                loading={loading}
                rows={pagination?.limit}
                value={artworks}
                selection={selectedArtworks}
                onSelectionChange={(e) =>
                    setSelectedArtworks((_) => [...e.value])
                }
                dataKey="id"
                tableStyle={{ minWidth: "50rem" }}
            >
                <Column
                    selectionMode="multiple"
                    headerStyle={{ width: "3rem" }}
                ></Column>
                <Column field="title" header="Title"></Column>
                <Column
                    field="place_of_origin"
                    header="Place of Origin"
                ></Column>
                <Column field="artist_display" header="Artist"></Column>
                <Column field="inscriptions" header="Inscriptions"></Column>
                <Column field="date_start" header="Date Start"></Column>
                <Column field="date_end" header="Date End"></Column>
            </DataTable>
            <Pagination
                onPageChange={onPageChange}
                currentPage={currentPage}
                totalPages={pagination?.total_pages || 1}
            />
        </div>
    );
}

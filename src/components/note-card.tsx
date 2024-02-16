import * as Dialog from "@radix-ui/react-dialog";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { X } from "lucide-react";

interface NoteCardProps {
    note: {
        id: string;
        date: Date;
        content: string;
    };
    onNoteDeleted: (id: string) => void;
}

export function NoteCard({ note, onNoteDeleted }: NoteCardProps) {
    return (
        <Dialog.Root>
            <Dialog.Trigger
                className="rounded-md bg-slate-800 p-5 text-left outline-none flex flex-col gap-3 overflow-hidden relative
                    hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400"
                >
                <span className="text-slate-300 text-sm font-medium">
                    {formatDistanceToNow(note.date, { locale: ptBR, addSuffix: true })}
                </span>
                <p className="text-slate-400 text-sm leading-6">
                    {note.content}
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none" />
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="inset-0 fixed bg-black/50" />
                <Dialog.Content className="fixed inset-0 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-[640px] w-full sm:h-[60vh] sm:rounded-md bg-slate-700 flex flex-col overflow-hidden">
                    <Dialog.Close className="absolute right-0 top-0 p-1.5 bg-slate-800 text-slate-400 hover:text-slate-100">
                        <X className="size-5" />
                    </Dialog.Close>

                    <div className="flex flex-1 flex-col gap-3 p-5">
                        <span className="text-sm font-medium text-slate-300">
                            {formatDistanceToNow(note.date, { locale: ptBR, addSuffix: true })}
                        </span>

                        <p className="text-sm leading-6 text-slate-400">
                            {note.content}
                        </p>
                    </div>
                    
                    <button 
                        type="button"
                        className="w-full p-4 bg-slate-800 text-slate-300 font-medium text-sm outline-none group"
                        onClick={() => onNoteDeleted(note.id)}
                    >
                        Deseja <span className="text-red-400 group-hover:underline group-focus-visible:underline">apagar essa nota</span>?
                    </button>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
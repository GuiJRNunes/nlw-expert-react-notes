import * as Dialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { ChangeEvent, useState } from "react"
import { toast } from "sonner"

interface NewNoteProps {
    onNoteCreated: (content: string) => void;
}

let speechRecognition: SpeechRecognition | null = null;

export function NewNoteCard({ onNoteCreated }: NewNoteProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);
    const [content, setContent] = useState("");

    function handleStartEditor() {
        setShouldShowOnboarding(false);
    }

    function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
        setContent(event.target.value);

        if (event.target.value === "") {
            setShouldShowOnboarding(true);
        }
    }

    function handleSaveNote() {
        if (content === "") {
            return;
        }

        onNoteCreated(content);
        setContent("");
        setShouldShowOnboarding(true);
        toast.success("Nota criada com sucesso!");
    }

    function handleStartRecording() {
        const isSpeechRecognitionAPIAvailable = "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

        if (!isSpeechRecognitionAPIAvailable) {
            toast.error("Infelizmente o seu navegador não possui a funcionalidade de reconhecimento de voz!");
            return;
        }

        console.log("Start recording", speechRecognition);
        if (speechRecognition === null) {

            const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
            speechRecognition = new SpeechRecognitionAPI();
            speechRecognition.lang = "pt-BR";
            speechRecognition.continuous = true; // Keep recording even if the user stops speaking
            speechRecognition.maxAlternatives = 1; // Use only one (the best) possible recognition of a given spoken passage
            speechRecognition.interimResults = true; // Allow non final results
            
            speechRecognition.onresult = (event) => {
                /* TODO : Test in different environments that support the speechRecognitionAPI */
                /* const transcription = Array.from(event.results).reduce((text, result) => {
                    return text.concat(result[0].transcript);
                }, ""); */
                let speechRecognitionResult = Array.from(event.results).pop();
                const transcription = speechRecognitionResult !== undefined 
                    ? speechRecognitionResult[0].transcript
                    : "";
                
                setContent(transcription);
            };
            
            speechRecognition.onerror = (event) => {
                console.error("onerror", event);
            };

            /* FIXME : For testing purposes */
            /* speechRecognition.onaudiostart = (event) => { console.error("onaudiostart", event); };
            speechRecognition.onaudioend = (event) => { console.error("onaudioend", event); };
            speechRecognition.onend = (event) => { console.error("onend", event); };
            speechRecognition.onnomatch = (event) => { console.error("onnomatch", event); };
            speechRecognition.onsoundstart = (event) => { console.error("onsoundstart", event); };
            speechRecognition.onsoundend = (event) => { console.error("onsoundend", event); };
            speechRecognition.onspeechstart = (event) => { console.error("onspeechstart", event); };
            speechRecognition.onspeechend = (event) => { console.error("onspeechend", event); };
            speechRecognition.onstart = (event) => { console.error("onstart", event); }; */
        }

        setIsRecording(true);
        setShouldShowOnboarding(false);

        speechRecognition.start();
    }

    function handleStopRecording() {
        setIsRecording(false);

        console.log("Before check", speechRecognition)
        if (speechRecognition !== null) {
            console.log("Before stop", speechRecognition)
            speechRecognition.stop();
            console.log("After stop", speechRecognition)
        }
    }

    return (
        <Dialog.Root>
            <Dialog.Trigger
                type="button"
                className="rounded-md bg-slate-700 p-5 text-left outline-none flex flex-col gap-3 overflow-hidden
                    hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400"
            >
                <span className="text-sm font-medium text-slate-200">
                  Adicionar nota
                </span>
                <p className="text-sm leading-6 text-slate-400">
                    Grave uma nota em áudio que será convertida para texto automaticamente.
                </p>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="inset-0 fixed bg-black/50" />
                <Dialog.Content 
                    className="fixed inset-0 w-full bg-slate-700 flex flex-col overflow-hidden outline-none
                        sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-[640px] sm:h-[60vh] sm:rounded-md"
                >
                    <Dialog.Close className="absolute right-0 top-0 p-1.5 bg-slate-800 text-slate-400 hover:text-slate-100">
                        <X className="size-5"/>
                    </Dialog.Close>

                    <form className="flex-1 flex flex-col gap-3">
                        <div className="flex flex-1 flex-col gap-3 p-5">
                            <span className="text-slate-200">
                                Adicionar nota
                            </span>

                            {shouldShowOnboarding ? (
                                <p className="text-slate-400">
                                    {"Comece "}
                                    <button 
                                        type="button"
                                        className="font-medium text-lime-400 hover:underline"
                                        onClick={handleStartRecording}
                                    >
                                        gravando uma nota
                                    </button>
                                    {" em áudio ou se preferir "}
                                    <button 
                                        type="button"
                                        className="font-medium text-lime-400 hover:underline"
                                        onClick={handleStartEditor}
                                    >
                                        utilize apenas texto
                                    </button>.
                                </p>
                            ) : (
                                <textarea 
                                    autoFocus
                                    className="text-sm leading-6 text-slate-400 resize-none outline-none bg-transparent flex-1"
                                    onChange={handleContentChanged}
                                    value={content}
                                />
                            )}
                            
                        </div>
                        
                        {isRecording ? (
                            <button
                                type="button"
                                className="w-full p-4 bg-slate-900 text-slate-300 font-medium text-sm outline-none flex items-center justify-center gap-3
                                    hover:text-slate-100 focus-visible:text-slate-100"
                                onClick={handleStopRecording}
                            >
                                <span className="flex h-3 w-3 pointer-events-none relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                                </span>
                                Gravando! Clique para interromper...
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="w-full p-4 bg-lime-400 text-lime-950 font-medium text-sm outline-none hover:bg-lime-500 focus-visible:bg-lime-500"
                                onClick={handleSaveNote}
                            >
                                Salvar nota
                            </button>
                        )}
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
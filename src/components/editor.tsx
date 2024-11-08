import Image from "next/image"
import { Button } from "@/components/ui/button";
import Quill from "quill";
import Qill, { QuillOptions } from "quill";
import { RiFontSize } from "react-icons/ri";
import "quill/dist/quill.snow.css";
import { MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ImageIcon, Key, Keyboard, SendIcon, Smile, XIcon } from "lucide-react";
import { Hint } from "./hint";
import { Delta, Op } from "quill/core";
import { cn } from "@/lib/utils";

type EditorValue = {
  image:File |null,
  body: string;
};
interface EditorProps {
  OnSubmit: ({ image, body }: EditorValue) => void;
  OnCancel?: () => void;
  placeholder?: string;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: MutableRefObject<Quill | null>;
  variant?: "create" | "update";
}

const Editor = ({
  OnCancel,
  OnSubmit,
  placeholder = "Write Something",
  defaultValue = [],
  innerRef,
  disabled,
  variant = "create",
}: EditorProps) => {
  const [text,setText]= useState("");
  const [image,setImage] = useState<File | null>(null)
  const containerRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef(OnSubmit);
  const placeholderRef = useRef(placeholder);
  const defaultValueRef = useRef(defaultValue);
  const quillRef = useRef<Quill | null>(null);
  const disabledRef = useRef(disabled);
  const imageElementRef = useRef<HTMLInputElement>(null);
  useLayoutEffect(() => {
submitRef.current = OnSubmit;
placeholderRef.current = placeholder;
defaultValueRef.current =defaultValue;
disabledRef.current =disabled;
  });
  useEffect(() => {
    if (!containerRef.current) return;
    console.log(containerRef.current);

    const container = containerRef.current;

    const editorConatiner = container.appendChild(
      container.ownerDocument.createElement("div")
    );

    const options: QuillOptions = {
      theme: "snow",
      placeholder:placeholderRef.current,
      modules:{
        toolbar:[
         ["bold","italic","strike"]
        ],
        keyboard:{

          bindings:{
            enter:{
               key : "Enter",
               handler:()=>{
                const text = quill.getText();
                const addedImage = imageElementRef.current?.files?.[0] || null;
                const isEmpty =!addedImage && text.replace(/<(.|\n)*?>/g, "").trim().length ===0;

                if(isEmpty){
                  return;
                }

                const body = JSON.stringify(quill.getContents())
                submitRef.current?.({
                  body,image:addedImage
                })

                return;
               }
            },
            shift_enter :{
              key:"Enter",
              shiftKey:true,
              handler:()=>{
                quill.insertText(quill.getSelection()?.index || 0,"\n");
              }
            }
          }
        }
      } 
    };

    const quill = new Quill(editorConatiner, options);
    quillRef.current = quill;
    quillRef.current.focus();
    if(innerRef){
      innerRef.current =quill;
      
    }
    quill.setContents(defaultValueRef.current)
    setText(quill.getText());

    quill.on(Quill.events.TEXT_CHANGE,()=>{
      setText(quill.getText())
    })
    return () => {
      quill.off(Quill.events.TEXT_CHANGE);
      if (container) {
        container.innerHTML = "";
      }
      if(quillRef.current){
        quillRef.current=null;
      }
      if(innerRef){
        innerRef.current=null;
      }
    };
  }, [innerRef]);

  const isEmpty =text.replace(/<(.|\n)*?>/g, "").trim().length ===0;
  return (
    <div className="flex flex-col">
      <input type="file" 
      accept="image/"
      ref={imageElementRef}
      onChange={(event)=>setImage(event.target.files![0])}

      className="hidden"
      />
      <div className={cn("flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm bg-white",disabled && "opacity-50")}>
        <div ref={containerRef} className="h-full ql-custom "></div>
        {!!image && (
          <div className="p-2">
            <div className="relative size-[62px] flex items-center justify-center group/image">
              <Hint label="Remove image">
              <button onClick={()=>{
                setImage(null)
                imageElementRef.current!.value =""
              }}
               
              className="hidden group-hover/image:flex  rounded-full  bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 z-[4] border-2 border-white items-center justify-center ">
                <XIcon className="size-3.5"/>
              </button>
                </Hint>
              <Image 
              src={URL.createObjectURL(image)}
              alt="Uploaded"
              fill
              className="rounded-xl  overflow-hidden border object-cover"
              />
            </div>
             
          </div>
        )}
        <div className="flex px-2 pb-2 z-[5]">
          <Hint label="Hide Formatting">
            <Button
              disabled={false}
              size="iconSm"
              variant="ghost"
              onClick={() => {}}
            >
              <RiFontSize className="size-4" />
            </Button>
          </Hint>

          <Hint label="Emoji">
            <Button
              disabled={disabled}
              size="iconSm"
              variant="ghost"
              onClick={() => {}}
            >
              {/* <PiText className = "size-4" /> */}
              <Smile className="size-4" />
            </Button>
          </Hint>

          {variant === "create" && (
            <Hint label="Image">
              <Button
                disabled={disabled}
                size="iconSm"
                variant="ghost"
                onClick={() => imageElementRef.current?.click()}
              >
                {/* <PiText className = "size-4" /> */}
                <ImageIcon className="size-4" />
              </Button>
            </Hint>
          )}

          {variant === "update" && (
            <div className="ml-auto flex items-center gap-x-2">
              <Button
                disabled={disabled}
                size="sm"
                variant="outline"
                onClick={OnCancel}
              >
                Cancel
              </Button>
              <Button
                disabled={disabled}
                size="sm"
                variant="outline"
                onClick={() => {
                  OnSubmit({
                    body:JSON.stringify(quillRef.current?.getContents()),image
                  })
                }}
                className=" bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
              >
                Save
              </Button>
            </div>
          )}
          {variant === "create" && (
            <Button
              disabled={disabled || isEmpty}
              onClick={() => {
                OnSubmit({
                  body:JSON.stringify(quillRef.current?.getContents()),image
                })
              }}
              className={cn("ml-auto" ,isEmpty ?"  bg-white hover:bg-white text-muted-foreground" :"  bg-[#007a5a] hover:bg-[#007a5a]/80 text-white" )}
            >
              {/* <PiText className = "size-4" /> */}
              <SendIcon className="size-4" />
            </Button>
          )}
        </div>
      </div>
      {variant==="create" && (
         <div className={cn("p-2 text-[10px] text-muted-foreground flex justify-end opacity-0 transition",!isEmpty && "opacity-100")}>
         <p>
           <strong>Shift + Return</strong> to add a new Line
         </p>
       </div>
      )}
    </div>
  );
};

export default Editor;

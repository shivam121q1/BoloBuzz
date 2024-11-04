import { Button } from "@/components/ui/button";
import Quill from "quill";
import Qill, { QuillOptions } from "quill"
import { RiFontSize } from "react-icons/ri";
import "quill/dist/quill.snow.css"
import { MutableRefObject, useEffect, useLayoutEffect, useRef } from "react"
import { ImageIcon, SendIcon, Smile } from "lucide-react";
import { Hint } from "./hint";
import { Delta, Op } from "quill/core";


type EditorValue ={
  image:File| null;
  body:string
}
interface EditorProps {
  OnSubmit : ({image,body}:EditorValue) =>void;
  OnCancel ?:()=>void;
  placeholder?:string;
  defaultValue?:Delta  | Op[];
  disabled?:boolean;
  innerRef?:MutableRefObject<Quill | null>;
  variant ?: "create" | "update"
}

const Editor = ({
  OnCancel,
  OnSubmit,
  placeholder="Write Something",
  defaultValue=[],
  innerRef,
  disabled,
  variant= "create"
}:EditorProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const submitRef = useRef(OnSubmit);
    const placeholderRef = useRef(placeholder);
    const quillRef= useRef<Quill |null>(null);
    const disabledRef=useRef(disabled);
    useLayoutEffect(()=>{
      
    })
    useEffect(()=>{
      if(!containerRef.current) return;
      console.log(containerRef.current)

      const container = containerRef.current;

      const editorConatiner = container.appendChild(
        container.ownerDocument.createElement("div")
      );

      const options: QuillOptions ={
        theme:"snow",

      }

      new Quill(editorConatiner,options);

      return ()=>{
        if(container){
          container.innerHTML="";
        }
      }
    },[])
  return (
    <div className='flex flex-col'>
        <div className='flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm bg-white'>
          <div ref={containerRef} className="h-full ql-custom "></div>
          <div className="flex px-2 pb-2 z-[5]">
            <Hint label="Hide Formatting">
            <Button
            
            disabled={false}
            size="iconSm"
            variant="ghost"
            onClick={()=>{}}>
                <RiFontSize className = "size-4" />

            </Button>

            </Hint>

            <Hint label="Emoji">
            <Button
            
            disabled={false}
            size="iconSm"
            variant="ghost"
            onClick={()=>{}}>
                {/* <PiText className = "size-4" /> */}
                <Smile className = "size-4" />
            </Button>

            </Hint>

            {variant ==="create" && (

<Hint label="Image">
<Button
 
 disabled={false}
 size="iconSm"
 variant="ghost"
 onClick={()=>{}}>
     {/* <PiText className = "size-4" /> */}
     <ImageIcon className = "size-4" />
 </Button>

</Hint>

 )}

 {variant ==="update"  && (
  <div className="ml-auto flex items-center gap-x-2">
    <Button 
    
 disabled={false}
 size="sm"
 variant="outline"
 onClick={()=>{}}>
      Cancel
    </Button>
    <Button 
    
 disabled={false}
 size="sm"
 variant="outline"
 onClick={()=>{}}
 className=" bg-[#007a5a] hover:bg-[#007a5a]/80 text-white">
      Save
    </Button>
  </div>
 )}
 {variant ==="create" && (

<Button
disabled={false}
onClick={()=>{}}
className="ml-auto bg-[#007a5a] hover:bg-[#007a5a]/80 text-white">
    {/* <PiText className = "size-4" /> */}
    <SendIcon className="size-4" />
</Button>
 )}
          
          
            

            
            
          </div>
        </div>
        
           <div className="p-2 text-[10px] text-muted-foreground flex justify-end">
           <p>
              <strong>Shift + Return</strong> to add a new Line
            </p>
           </div>
        
      

      
    </div>
  )
}

export default Editor

"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Copy, GripVertical, MoreHorizontal, Plus, X, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

type ContentType =
  | "large-heading"
  | "small-heading"
  | "media"
  | "short-answer"
  | "paragraph"
  | "date-picker"
  | "selection"

interface ContentItem {
  id: string
  type: ContentType
  heading: string
  options?: string[]
  placeholder?: string
}

interface Screen {
  id: string
  title: string
  content: ContentItem[]
}

export default function FlowBuilder() {
  const [screens, setScreens] = useState<Screen[]>([
    {
      id: "1",
      title: "First Screen",
      content: [
        {
          id: "1-1",
          type: "small-heading",
          heading: "Would you recommend us to a friend?",
        },
        {
          id: "1-2",
          type: "selection",
          heading: "Choose one",
          options: ["Yes", "No"],
        },
        {
          id: "1-3",
          type: "small-heading",
          heading: "How could we do better?",
        },
        {
          id: "1-4",
          type: "paragraph",
          heading: "Your feedback",
          placeholder: "Leave a comment (optional)",
        },
      ],
    },
  ])
  const [selectedScreen, setSelectedScreen] = useState<string>("1")

  const addNewScreen = () => {
    const newScreen: Screen = {
      id: String(screens.length + 1),
      title: `Feedback ${screens.length + 1}`,
      content: [],
    }
    setScreens([...screens, newScreen])
  }

  const removeScreen = (id: string) => {
    setScreens(screens.filter((screen) => screen.id !== id))
    if (selectedScreen === id) {
      setSelectedScreen(screens[0]?.id || "")
    }
  }

  const updateScreenTitle = (screenId: string, newTitle: string) => {
    setScreens(screens.map((screen) => (screen.id === screenId ? { ...screen, title: newTitle } : screen)))
  }

  const updateContentHeading = (screenId: string, contentId: string, newHeading: string) => {
    setScreens(
      screens.map((screen) =>
        screen.id === screenId
          ? {
              ...screen,
              content: screen.content.map((content) =>
                content.id === contentId ? { ...content, heading: newHeading } : content,
              ),
            }
          : screen,
      ),
    )
  }

  const addContent = (type: ContentType) => {
    const currentScreen = screens.find((screen) => screen.id === selectedScreen)
    if (!currentScreen) return

    const newContent: ContentItem = {
      id: `${selectedScreen}-${currentScreen.content.length + 1}`,
      type,
      heading: `New ${type.replace("-", " ")}`,
      ...(type === "selection" ? { options: ["Option 1", "Option 2"] } : {}),
      ...(type === "paragraph" || type === "short-answer" ? { placeholder: "Enter text" } : {}),
    }

    setScreens(
      screens.map((screen) =>
        screen.id === selectedScreen ? { ...screen, content: [...screen.content, newContent] } : screen,
      ),
    )
  }

  const removeContent = (screenId: string, contentId: string) => {
    setScreens(
      screens.map((screen) =>
        screen.id === screenId
          ? { ...screen, content: screen.content.filter((content) => content.id !== contentId) }
          : screen,
      ),
    )
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const currentScreen = screens.find((screen) => screen.id === selectedScreen)
    if (!currentScreen) return

    const newContent = Array.from(currentScreen.content)
    const [reorderedItem] = newContent.splice(result.source.index, 1)
    newContent.splice(result.destination.index, 0, reorderedItem)

    setScreens(screens.map((screen) => (screen.id === selectedScreen ? { ...screen, content: newContent } : screen)))
  }

  const currentScreen = screens.find((screen) => screen.id === selectedScreen)

  return (
    <div className="grid h-full lg:grid-cols-[400px_1fr] gap-8 p-6">
      <div className="space-y-6">
        <h2 className="font-semibold text-lg">Screens</h2>
        <ul className="space-y-2">
          {screens.map((screen) => (
            <li key={screen.id} className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 justify-start font-normal"
                onClick={() => setSelectedScreen(screen.id)}
              >
                {screen.title}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => removeScreen(screen.id)}>
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
        <Button variant="outline" size="sm" className="w-full justify-start" onClick={addNewScreen}>
          <Plus className="h-4 w-4 mr-2" />
          Add new
        </Button>

        {currentScreen && (
          <section className="space-y-4">
            <h2 className="font-semibold text-lg">Edit content</h2>
            <div className="space-y-2">
              <Label htmlFor="screen-title">Screen title</Label>
              <Input
                id="screen-title"
                value={currentScreen.title}
                onChange={(e) => updateScreenTitle(currentScreen.id, e.target.value)}
              />
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="content-list">
                {(provided) => (
                  <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                    {currentScreen.content.map((content, index) => (
                      <Draggable key={content.id} draggableId={content.id} index={index}>
                        {(provided) => (
                          <li ref={provided.innerRef} {...provided.draggableProps}>
                            <Collapsible className="border rounded-md">
                              <div className="flex items-center justify-between p-3">
                                <CollapsibleTrigger className="flex items-center gap-2">
                                  <div {...provided.dragHandleProps}>
                                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                  <span className="text-sm font-medium">{content.type.replace("-", " ")}</span>
                                </CollapsibleTrigger>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeContent(currentScreen.id, content.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              <CollapsibleContent className="p-3 pt-0">
                                <Label htmlFor={`heading-${content.id}`}>Heading</Label>
                                <Input
                                  id={`heading-${content.id}`}
                                  value={content.heading}
                                  onChange={(e) => updateContentHeading(currentScreen.id, content.id, e.target.value)}
                                />
                              </CollapsibleContent>
                            </Collapsible>
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Add content
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    Text
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onSelect={() => addContent("large-heading")}>Large Heading</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => addContent("small-heading")}>Small Heading</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuItem onSelect={() => addContent("media")}>Media</DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    Text Answer
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onSelect={() => addContent("short-answer")}>Short Answer</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => addContent("paragraph")}>Paragraph</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => addContent("date-picker")}>Date Picker</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuItem onSelect={() => addContent("selection")}>Selection</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </section>
        )}
      </div>

      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <h2 className="font-semibold text-lg">Preview</h2>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Copy className="h-4 w-4" />
              Save
            </Button>
          </div>
        </header>

        <div className="flex justify-center">
          <div className="w-[360px] h-[640px] bg-white rounded-3xl p-4 shadow-lg">
            <div className="h-full overflow-auto rounded-2xl border">
              {currentScreen && (
                <div className="p-4 space-y-6">
                  <header className="flex items-center justify-between">
                    <h3 className="font-medium">{currentScreen.title}</h3>
                    
                  </header>
                  {currentScreen.content.map((content) => (
                    <div key={content.id} className="space-y-2">
                      {content.type === "large-heading" && <h1 className="text-2xl font-bold">{content.heading}</h1>}
                      {content.type === "small-heading" && <h2 className="text-lg font-semibold">{content.heading}</h2>}
                      {content.type === "media" && (
                        <div className="bg-muted h-40 flex items-center justify-center rounded-md">
                          Media Placeholder
                        </div>
                      )}
                      {content.type === "short-answer" && (
                        <>
                          <Label htmlFor={`short-answer-${content.id}`}>{content.heading}</Label>
                          <Input id={`short-answer-${content.id}`} placeholder={content.placeholder} />
                        </>
                      )}
                      {content.type === "paragraph" && (
                        <>
                          <Label htmlFor={`paragraph-${content.id}`}>{content.heading}</Label>
                          <Textarea
                            id={`paragraph-${content.id}`}
                            placeholder={content.placeholder}
                            className="resize-none"
                          />
                        </>
                      )}
                      {content.type === "date-picker" && (
                        <>
                          <Label htmlFor={`date-picker-${content.id}`}>{content.heading}</Label>
                          <Input id={`date-picker-${content.id}`} type="date" />
                        </>
                      )}
                      {content.type === "selection" && (
                        <>
                          <Label>{content.heading}</Label>
                          <RadioGroup>
                            {content.options?.map((option) => (
                              <div key={option} className="flex items-center space-x-2">
                                <RadioGroupItem value={option} id={`${content.id}-${option}`} />
                                <Label htmlFor={`${content.id}-${option}`}>{option}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </>
                      )}
                    </div>
                  ))}
                  <Button className="w-full">Continue</Button>
                  <footer className="text-center text-sm text-muted-foreground">
                    Managed by the business.{" "}
                    <Button variant="link" className="h-auto p-0">
                      Learn more
                    </Button>
                  </footer>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


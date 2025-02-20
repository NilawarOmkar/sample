"use client"

import { useState } from "react"
import { GripVertical, MoreHorizontal, Plus, X, ChevronRight, Save } from "lucide-react"
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

type JSONComponent = 
    | { type: 'TextHeading'; text: string }
    | { type: 'TextBody'; text: string }
    | { type: 'TextInput'; label: string; name: string; 'input-type': 'text' | 'email' | 'number' | 'password' | 'passcode' | 'phone'; required: boolean }
    | { type: 'TextArea'; label: string; name: string; placeholder?: string; required: boolean }
    | { type: 'DatePicker'; label: string; name: string; required: boolean }
    | { type: 'RadioButtonsGroup'; label: string; name: string; required: boolean; 'data-source': Array<{ id: string; title: string }> }
    | { type: 'Media'; src: string }
    | { type: 'Footer'; label: string; 'on-click-action': { name: string; payload?: Record<string, string>; next?: { name: string; type: string } } }

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

    const generateJSON = () => {
        const jsonScreens = screens.map((screen, screenIndex) => {
            const isLastScreen = screenIndex === screens.length - 1
            const nextScreenId = `SCREEN_${screenIndex + 1}`
            const screenId = `SCREEN_${screenIndex}`

            const fieldNames: string[] = []
            const formChildren: JSONComponent[] = screen.content.map((content, contentIndex) => {
                const sanitizedHeading = content.heading.replace(/[^a-zA-Z]/g, '_')
                const baseName = `screen_${screenIndex}_${sanitizedHeading}_${contentIndex}`

                switch (content.type) {
                    case 'large-heading':
                        return { type: 'TextHeading', text: content.heading }
                    case 'small-heading':
                        return { type: 'TextBody', text: content.heading }
                    case 'short-answer':
                        fieldNames.push(baseName)
                        return {
                            type: 'TextInput',
                            label: content.heading,
                            name: baseName,
                            'input-type': 'text',
                            required: false
                        }
                    case 'paragraph':
                        fieldNames.push(baseName)
                        return {
                            type: 'TextArea',
                            label: content.heading,
                            name: baseName,
                            placeholder: content.placeholder,
                            required: false
                        }
                    case 'date-picker':
                        fieldNames.push(baseName)
                        return {
                            type: 'DatePicker',
                            label: content.heading,
                            name: baseName,
                            required: false
                        }
                    case 'selection':
                        fieldNames.push(baseName)
                        return {
                            type: 'RadioButtonsGroup',
                            label: content.heading,
                            name: baseName,
                            required: false,
                            'data-source': content.options?.map((option, i) => ({
                                id: `${screenIndex}_${contentIndex}_${i}`.toUpperCase(),
                                title: option
                            })) || []
                        }
                    case 'media':
                        return {
                            type: 'Media',
                            src: 'placeholder.jpg'
                        }
                    default:
                        return { type: 'TextBody', text: 'Unsupported component' }
                }
            })

            const footerComponent: JSONComponent = {
                type: 'Footer',
                label: isLastScreen ? 'Done' : 'Continue',
                'on-click-action': {
                    name: isLastScreen ? 'complete' : 'navigate',
                    ...(!isLastScreen && {
                        next: {
                            name: nextScreenId,
                            type: 'screen'
                        }
                    }),
                    payload: fieldNames.reduce((acc: Record<string, string>, name) => {
                        acc[name] = "${form." + name + "}"
                        return acc
                    }, {})
                }
            }

            return {
                id: screenId,
                title: screen.title,
                data: {},
                layout: {
                    type: "SingleColumnLayout",
                    children: [{
                        type: "Form",
                        name: "flow_path",
                        children: [...formChildren, footerComponent]
                    }]
                },
                ...(isLastScreen && { terminal: true })
            }
        })

        return {
            version: "6.3",
            screens: jsonScreens
        }
    }

    const exportJSON = () => {
        const json = generateJSON()
        const dataStr = JSON.stringify(json, null, 2)
        const blob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'flow.json'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const addNewScreen = () => {
        const newScreen: Screen = {
            id: String(screens.length + 1),
            title: `Screen ${screens.length + 1}`,
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

    const currentScreen = screens.find((screen) => screen.id === selectedScreen)

    return (
        <div className="grid h-full lg:grid-cols-[400px_1fr] gap-8 p-6">
            {/* Left sidebar */}
            <div className="space-y-6">
                <div className="font-semibold text-lg">Screens</div>
                <div className="space-y-2">
                    {screens.map((screen) => (
                        <div key={screen.id} className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
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
                        </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full justify-start" onClick={addNewScreen}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add new
                    </Button>
                </div>

                {currentScreen && (
                    <div className="space-y-6">
                        <div className="font-semibold text-lg">Edit content</div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Screen title</Label>
                                <Input
                                    value={currentScreen.title}
                                    onChange={(e) => updateScreenTitle(currentScreen.id, e.target.value)}
                                />
                            </div>

                            {currentScreen.content.map((content) => (
                                <Collapsible key={content.id} className="space-y-2 border rounded-md p-3">
                                    <div className="flex items-center justify-between">
                                        <CollapsibleTrigger className="flex items-center gap-2">
                                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">{content.type.replace("-", " ")}</span>
                                        </CollapsibleTrigger>
                                        <Button variant="ghost" size="icon" onClick={() => removeContent(currentScreen.id, content.id)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <CollapsibleContent className="space-y-2">
                                        <Label>Heading</Label>
                                        <Input
                                            value={content.heading}
                                            onChange={(e) => updateContentHeading(currentScreen.id, content.id, e.target.value)}
                                        />
                                    </CollapsibleContent>
                                </Collapsible>
                            ))}

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
                        </div>
                    </div>
                )}
            </div>

            {/* Preview panel */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="font-semibold text-lg">Preview</div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="gap-2" onClick={exportJSON}>
                            <Save className="h-4 w-4" />
                            Save
                        </Button>
                    </div>
                </div>

                <div className="flex justify-center">
                    <div className="w-[360px] h-[640px] bg-white rounded-3xl p-4 shadow-lg">
                        <div className="h-full overflow-auto rounded-2xl border">
                            {currentScreen && (
                                <div className="p-4 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="font-medium">{currentScreen.title}</div>
                                        <Button variant="ghost" size="icon">
                                            {/* <MoreHorizontal className="h-4 w-4" /> */}
                                        </Button>
                                    </div>
                                    {currentScreen.content.map((content) => (
                                        <div key={content.id} className="space-y-4">
                                            {content.type === "large-heading" && <h1 className="text-2xl font-bold">{content.heading}</h1>}
                                            {content.type === "small-heading" && <h2 className="text-lg font-semibold">{content.heading}</h2>}
                                            {content.type === "media" && (
                                                <div className="bg-muted h-40 flex items-center justify-center rounded-md">
                                                    Media Placeholder
                                                </div>
                                            )}
                                            {content.type === "short-answer" && (
                                                <>
                                                    <Label>{content.heading}</Label>
                                                    <Input placeholder={content.placeholder} />
                                                </>
                                            )}
                                            {content.type === "paragraph" && (
                                                <>
                                                    <Label>{content.heading}</Label>
                                                    <Textarea placeholder={content.placeholder} className="resize-none" />
                                                </>
                                            )}
                                            {content.type === "date-picker" && (
                                                <>
                                                    <Label>{content.heading}</Label>
                                                    <Input type="date" />
                                                </>
                                            )}
                                            {content.type === "selection" && (
                                                <>
                                                    <Label>{content.heading}</Label>
                                                    <RadioGroup>
                                                        {content.options?.map((option) => (
                                                            <div key={option} className="flex items-center space-x-2">
                                                                <RadioGroupItem value={option} id={option} />
                                                                <Label htmlFor={option}>{option}</Label>
                                                            </div>
                                                        ))}
                                                    </RadioGroup>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                    <Button className="w-full">Continue</Button>
                                    <div className="text-center text-sm text-muted-foreground">
                                        Managed by the business.{" "}
                                        <Button variant="link" className="h-auto p-0">
                                            Learn more
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
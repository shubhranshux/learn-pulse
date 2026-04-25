import React, { useState } from 'react'
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
const categories = [
    { id: "nextjs", label: "Next JS" },
    { id: "data science", label: "Data Science" },
    { id: "frontend development", label: "Frontend Development" },
    { id: "fullstack development", label: "Fullstack Development" },
    { id: "mern stack development", label: "MERN Stack Development" },
    { id: "backend development", label: "Backend Development" },
    { id: "javascript", label: "Javascript" },
    { id: "python", label: "Python" },
    { id: "docker", label: "Docker" },
    { id: "mongodb", label: "MongoDB" },
    { id: "html", label: "HTML" },
];

function Filter({ handleFilterChange }) {

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [sortByPrice, setSortByPrice] = useState("");

    const handleCategoryChange = (categoryId) => {
        setSelectedCategories((prevCategories) => {
            const newCategories = prevCategories.includes(categoryId) ? prevCategories.filter((id) => id !== categoryId) : [...prevCategories, categoryId];
            handleFilterChange(newCategories, sortByPrice);
            return newCategories;
        });
    };

    const selectByPriceHandler = (selectedValue) => {
        setSortByPrice(selectedValue);
        handleFilterChange(selectedCategories, selectedValue);
    }
    return (
        <div className='w-full md:w-[220px] lg:w-[240px]'>
            <div className='flex items-center justify-between gap-3'>
                <h1 className='font-semibold text-base sm:text-lg md:text-xl'>Filter Options</h1>
                <Select onValueChange={selectByPriceHandler}>
                    <SelectTrigger className="w-[120px] sm:w-[130px] text-xs sm:text-sm h-9">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel className="text-xs">Sort by price</SelectLabel>
                            <SelectItem value="low" className="text-sm">Low to High</SelectItem>
                            <SelectItem value="high" className="text-sm">High to Low</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <Separator className="my-3 sm:my-4" />
            <div>
                <h1 className='font-semibold mb-2 text-xs sm:text-sm uppercase tracking-wider text-muted-foreground'>Category</h1>
                <div className='grid grid-cols-2 md:grid-cols-1 gap-x-4 gap-y-1'>
                    {
                        categories.map((category) => (
                            <div key={category.id} className='flex items-center space-x-2 my-1 sm:my-1.5'>
                                <Checkbox
                                    id={category.id}
                                    onCheckedChange={() => handleCategoryChange(category.id)}
                                    className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                                />
                                <Label className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer" htmlFor={category.id}>
                                    {category.label}
                                </Label>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Filter

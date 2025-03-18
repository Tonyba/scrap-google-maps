"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, XIcon } from "lucide-react";
import { useState } from "react";
import { SearchSelect } from "@/components/ui/search-select";

import { useRouter } from 'next/navigation'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { MultiSelect } from "@/components/ui/multi-select";
import { COUNTRIES, MAP_PLACES_TYPES } from "@/utils/constans";
import { IGeolocation, ScrappingRequest } from "@/utils/types";
import { parseRequestArgs } from "@/helpers/helper";

const optsList = MAP_PLACES_TYPES.map((val) => {
  return {
    value: val,
    label: val
  }
});

const countryList = COUNTRIES.map((val) => {
  return {
    value: val,
    label: val
  }
});

export default function Home() {

  const router = useRouter()

  const [searchTerms, setSearchTerms] = useState<string[]>(['']);
  const [selectedCats, setSelectedCats] = useState<string[]>(['']);
  const [geolocation, setGeolocation] = useState<IGeolocation>({
    city: '',
    country: '',
    county: '',
    postal_code: '',
    state: ''
  });

  const [extraConfig, setExtraConfig] = useState({
    radius: 1000,
    max_places: 10
  });

  const addNewSearchTerm = () => {
    setSearchTerms([...searchTerms, '']);
  }

  const removeSearchTerm = (index: number) => {
    setSearchTerms(searchTerms.filter((_, i) => i !== index));
  };

  const onChangeTerm = (index: number, value: string) => {

    const updatedTerms = searchTerms.map((term, i) =>
      i === index ? value : term
    );

    setSearchTerms(updatedTerms);
  }

  const onGeoChange = (field: keyof IGeolocation, value: string) => {
    const updatedGeo = { ...geolocation };
    updatedGeo[field] = value;

    setGeolocation(updatedGeo);
  };


  const handleRequest = () => {

    const request: ScrappingRequest = {
      geolocation,
      max_places: extraConfig.max_places,
      radius: extraConfig.radius,
      types: selectedCats,
      query_search: searchTerms.join(' ').trim()
    };

    const params_string = parseRequestArgs(request);

    router.push(`/results${params_string}`);
  }

  return (
    <div className="max-w-2xl py-10 px-3 m-auto min-h-screen flex flex-col justify-center gap-10 [&_p]:mb-5 [&_label]:mb-2 [&_label]:block">

      <h1 >Scrapping Google Places</h1>

      <div className="filter-container">

        <p>To extract contact details from Google places, simply enter 🔍 Search term, add 📍 Location, and 💯 Number of places to extract. Section 🎯 Filters contains various extra features, filters, and sorting options.
        </p>
        <p>
          Sections with asterisk* are just alternative ways to start the input (📡 Geolocation parameters, 🛰 Polygons, 🔗 URLs). They can be combined with any of the features and sorting options from the Filters section.
        </p>

        <div className="search-terms-wrapper">

          <label htmlFor="">🔍 Search terms</label>

          <div className="p-4 border-1 rounded-sm">

            <div className="search-terms-list pb-2.5 flex flex-col gap-4">

              {searchTerms.map((term, index) => (

                <div className="flex gap-5">

                  <Input type="text" value={term} onChange={(e) => onChangeTerm(index, e.target.value)} />

                  <Button onClick={() => removeSearchTerm(index)} variant="outline" className="hover:bg-red-500 hover:text-white cursor-pointer" size="icon"> <XIcon />  </Button>

                </div>


              ))}

            </div>

            <Button onClick={addNewSearchTerm} className="bg-blue-600 cursor-pointer" size="sm">  <Plus /> Add</Button>
          </div>


        </div>

      </div>

      {/* <div className="filter-container">
        <label htmlFor="max_results">💯 Number of places to extract (per each search term or URL)</label>
        <Input type="number" name="max_results" id="max_results" value={extraConfig.max_places} onChange={(e) => setExtraConfig({ ...extraConfig, max_places: parseInt(e.target.value) })} />
      </div> */}

      <div className="filter-container">
        <label htmlFor="radius">Search Radius (in meters)</label>
        <Input type="number" name="radius" id="radius" value={extraConfig.radius} onChange={(e) => setExtraConfig({ ...extraConfig, radius: parseInt(e.target.value) })} />
      </div>

      <div className="filter-container">

        <Accordion type="single" collapsible className="w-full [&_button]:cursor-pointer divider-0 *:border-0 gap-5 flex flex-col">
          <AccordionItem value="item-1">

            <AccordionTrigger className="justify-normal border-1 data-[state=open]:rounded-b-none hover:decoration-0 bg-gray-200 px-4 data-[state=open]:bg-white" >🎯 Filters and precise search</AccordionTrigger>

            <AccordionContent className="p-5 border-1 rounded-b-sm border-t-0">
              <p>Use this section to pre-filter places by rating, name match, or website presence, or to speed up scraping by skipping details.
              </p>
              <p>⚠️ Note that using 🎢 Place categories can affect your search accuracy.</p>
              <p>Categories might filter out places that you would like to scrape. To avoid this issue, you must list all categories that you want to scrape, including synonyms, e.g. divorce lawyer, divorce attorney, divorce service, etc. See the detailed description.</p>

              <div className="filter-select">
                <label htmlFor="">🎢 Place category</label>
                <SearchSelect
                  options={optsList}
                  selected={selectedCats[0]}
                  setSelected={(optSelected) => setSelectedCats([optSelected])}
                  placeholder="Select Category..."
                />

                {/* <MultiSelect
                  options={optsList}
                  onValueChange={setSelectedCats}
                  defaultValue={selectedCats}
                  placeholder="Select..."
                  variant="secondary"
                  maxCount={4}
                /> */}
              </div>

            </AccordionContent>

          </AccordionItem>

          <AccordionItem value="item-2">

            <AccordionTrigger className="justify-normal border-1 data-[state=open]:rounded-b-none hover:decoration-0 bg-gray-200 px-4 data-[state=open]:bg-white" >📡 Geolocation parameters*</AccordionTrigger>

            <AccordionContent className="p-5 border-1 rounded-b-sm border-t-0">

              <p>Use this advanced section to define your scraping area in other ways than 📍Location. Just make sure to clear the 📍Location field first, as it always has priority.
              </p>

              <p className="mb-0">
                You can customize your area by:  </p>

              <ol className="mb-5">
                <li> using combinations of specific 🗺 Location types (Country, City, State, US county, and Postal code).</li>

              </ol>


              <div className="flex flex-col gap-5">

                <div className="filter-geo">
                  <label htmlFor="country">🗺 Country</label>

                  <SearchSelect
                    options={countryList}
                    selected={geolocation.country}
                    setSelected={(optSelected) => onGeoChange('country', optSelected)}
                    placeholder="Select..."
                  />



                </div>

                <div className="filter-geo">
                  <label htmlFor="city">🌇 City</label>

                  <Input id="city" type="text" value={geolocation.city} onChange={(e) => onGeoChange('city', e.target.value)} />

                </div>

                <div className="filter-geo">
                  <label htmlFor="state">State</label>

                  <Input id="state" type="text" value={geolocation.state} onChange={(e) => onGeoChange('state', e.target.value)} />

                </div>

                <div className="filter-geo">
                  <label htmlFor="county">US County</label>

                  <Input id="county" type="text" value={geolocation.county} onChange={(e) => onGeoChange('county', e.target.value)} />

                </div>

                <div className="filter-geo">
                  <label htmlFor="postal_code">Postal Code</label>

                  <Input id="postal_code" type="text" value={geolocation.postal_code} onChange={(e) => onGeoChange('postal_code', e.target.value)} />

                </div>

              </div>


            </AccordionContent>

          </AccordionItem>

        </Accordion>

      </div>

      <div className="buttons">
        <Button className="cursor-pointer" variant="secondary" onClick={handleRequest}>Start Scrapping</Button>
      </div>

    </div>
  );
}

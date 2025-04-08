# Loading the required packages.
import os
import time
import chardet
import pandas as pd
from pygbif import occurrences

def get_all_observations_for_species(search_string):
    results = []
    limit = 100000  # Maximum number of results per request.
    offset = 0     # Offset to paginate through the results

    while True:
        try:
            # Request data with pagination support (offset and limit)
            response = occurrences.search(q=search_string, limit=limit, offset=offset, spellCheck=True)

            # If no results or no response, break the loop
            if not response or not response.get('results'):
                break

            # Process the results
            for observation in response['results']:
                results.append({
                    'search_string': search_string,
                    "taxon_key": observation.get("taxonKey", "NA"),
                    'scientific_name': observation.get("scientificName", "NA"),
                    'species': observation.get("species", "NA"),
                    'kingdom': observation.get("kingdom", "NA"),
                    'latitude': observation.get("decimalLatitude", "NA"),
                    'longitude': observation.get("decimalLongitude", "NA"),
                    'observation_date': observation.get("eventDate", "NA"),
                    'coordinate_precision': observation.get("coordinatePrecision", "NA"),
                    'country': observation.get("country", "NA"),
                    'continent': observation.get("continent", "NA")
                })

            # Check if the number of results is less than the limit, indicating all data has been retrieved
            if len(response['results']) < limit:
                break  # No more results to fetch

            # Increment the offset to fetch the next batch of results
            offset += limit
            time.sleep(1)  # Delay to prevent hitting rate limits

        except Exception as e:
            print(f"Error retrieving data for {search_string}: {e}")
            break

    return results

# Base directory and file processing logic.
base_directory = r"F:\Kanji_Projects\2024\4.Komi\GBIF\Komi folder 2"
dirs = os.listdir(base_directory)
species_with_no_observations = []

for dir in dirs:
    print(f"Accessing data in folder: {dir}")
    input_dir = os.path.join(base_directory, dir)
    results_dir = dir + "_gbif_results"
    output_dir = os.path.join(input_dir, results_dir)
    os.makedirs(output_dir, exist_ok=True)

    for file in os.listdir(input_dir):
        if file.endswith('.csv'):
            filename, extension = os.path.splitext(file)
            data_file_path = os.path.join(input_dir, file)
            output_data_dir = os.path.join(output_dir, filename)
            os.makedirs(output_data_dir, exist_ok=True)
            output_data_dir_list = os.listdir(output_data_dir)

            print(f"Accessing data in file: {file}")
            with open(data_file_path, "rb") as f:
                file_encoding = chardet.detect(f.read())  # Detect file encoding
            species_data = pd.read_csv(data_file_path, header=None, encoding=file_encoding["encoding"])
            species_list = species_data.iloc[:, 0].tolist()  # Get species names from the first column

            # Iterate through each species in the list
            for string in species_list:
                string_to_find = f'{string}_gbif_observations.csv'
                if string_to_find not in output_data_dir_list:
                    print(f"Requesting data for: {string}")
                    # Fetch all observations for the species using pagination
                    observations = get_all_observations_for_species(string)
                    output_path = os.path.join(output_data_dir, f"{string}_gbif_observations.csv")

                    observations_df = pd.DataFrame(observations)
                    if observations_df.empty:
                        species_with_no_observations.append(string)
                        print(f"No observations found for {string}. Skipping...")
                        continue

                    # Save observations to CSV.
                    observations_df.to_csv(output_path, index=False)
                    del observations_df  # Free up memory

        print(f'Finished with file: {file}')
    print(f"Finished requesting data from dir: {dir}")

print("Finished Data request")
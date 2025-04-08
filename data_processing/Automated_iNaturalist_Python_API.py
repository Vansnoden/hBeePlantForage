# Loading the required packages.
import os
import chardet
import pandas as pd
from pyinaturalist import get_observations

# Function to get iNaturalist observations for a specie, handling pagination to get all observations.
def get_all_observations_for_species(search_string):
    results = []
    page = 1
    per_page = 200  # Maximum number of allowed observations per page.

    while True:
        try:
            response = get_observations(q=search_string, page=page, per_page=per_page, geo=True)
            if not response or not response.get('results'):
                break  # Exit if there are no more results.

            for observation in response['results']:
                # Safely extract data, avoiding errors for missing fields.
                taxon_id = observation.get("taxon", {}).get("id")
                taxon = observation.get("taxon", {}).get("name")
                species_name = observation.get("species_guess")
                user = observation.get("user", {}).get("login")
                latitude = observation.get("geojson", {}).get("coordinates", [None, None])[1]
                longitude = observation.get("geojson", {}).get("coordinates", [None, None])[0]
                location_accuracy = observation.get("positional_accuracy")
                observed_on = observation.get("observed_on")
                location_name = observation.get("place_guess")

                # Add the data to the results list.
                results.append({
                    'search_string': search_string,
                    'taxon_id': taxon_id,
                    'taxon': taxon,
                    'species': species_name,
                    'user': user,
                    'latitude': latitude,
                    'longitude': longitude,
                    'location_accuracy': location_accuracy,
                    'observed_on': observed_on,
                    'location_name': location_name
                })

            page += 1 # Move to the next page.

        except Exception as e:
            print(f"Error retrieving data for {search_string}: {e}")
            break

    return results

# Loop through the species data and collect all observation data.
base_directory = r"F:\Kanji_Projects\2024\4.Komi\iNaturalist\Komi folder\Komi folder"

dirs = os.listdir(base_directory)
species_with_no_observations = []

for dir in dirs:
    print(f'Accessing data in folder: {dir}')
    parent_dir_path = os.path.join(base_directory, dir)
    # print(f'Parent directory: {parent_dir}')
    results_dir = dir + '_results'
    results_dir_path = os.path.join(parent_dir_path, results_dir)
    # print(f'Results directory: {results_dir_path}')
    os.makedirs(results_dir_path, exist_ok=True)
    for file in os.listdir(parent_dir_path):
        if file.endswith('.csv'):
            data_file_path = os.path.join(parent_dir_path, file)
            filename, extension = os.path.splitext(file) # Split the base name into filename and extension.
            data_dir_path = os.path.join(results_dir_path, filename) # Create a new directory path with the same name as the file.
            os.makedirs(data_dir_path, exist_ok=True) # Create the directory if it doesn't exist.
            
            # Reading the specie names data from a CSV file.
            print(f"Accessing data in file: {file}")
            with open(data_file_path, "rb") as f:
                file_encoding = chardet.detect(f.read())
            species_data = pd.read_csv(data_file_path, header=None, encoding=file_encoding["encoding"])
            species_list = species_data.iloc[:, 0].tolist()

            # Looping through all the specie names and collecting the observation data.
            for string in species_list:
                output_path = os.path.join(data_dir_path, f'{string}_observations.csv')
                print(f'Requesting data for: {string}')
                observations = get_all_observations_for_species(string)

                observations_df = pd.DataFrame(observations) # Convert the observation data into a DataFrame.

                # Check if the observations DataFrame is empty.
                if observations_df.empty:
                    species_with_no_observations.append(string)
                    print(f"No observations found for {string}. Skipping...")
                    continue

                # Standardize the date format.
                observations_df['observed_on'] = pd.to_datetime(observations_df['observed_on'], format='mixed', utc=True)
                observations_df["observed_on"] = observations_df["observed_on"].dt.date

                # observations_df.head() # Display the first few observations.

                observations_df.to_csv(output_path, index=False) # Export the observations DataFrame to a CSV file.
                
                del observations_df # Free up memory by deleting the DataFrame.

    print(f'Finished requesting data from dir:{dir}')
    
print('Finished Data request')    
# Loading the required packages.
import os
import pandas as pd
import shutil

# Paths to your base directories.
base_dir_inat = r"F:\Kanji_Projects\2024\4.Komi\gbif_inaturalist\2.Plant_Species_Data\Preferred_nectar_data\Preferred_nectar data_inaturalist_results"
base_dir_gbif = r"F:\Kanji_Projects\2024\4.Komi\gbif_inaturalist\2.Plant_Species_Data\Preferred_nectar_data\Preferred_nectar data_gbif_results"

# Output directory where concatenated/copied files will be saved.
output_dir = r"F:\Kanji_Projects\2024\4.Komi\gbif_inaturalist\2.Plant_Species_Data\Preferred_nectar_data\Preferred_nectar data_merged_results"
os.makedirs(output_dir, exist_ok=True)  # Create output directory if it doesn't exist

# Function to extract the base name (before the first underscore) from a filename
def get_base_name(file_name):
    return file_name.split('_')[0]

# Iterate over subfolders in the inaturalist results folder
for subfolder in os.listdir(base_dir_inat):
    inat_subfolder_path = os.path.join(base_dir_inat, subfolder)
    gbif_subfolder_path = os.path.join(base_dir_gbif, subfolder)
    output_subfolder_path = os.path.join(output_dir, subfolder)
    
    # Create the corresponding output subfolder
    os.makedirs(output_subfolder_path, exist_ok=True)
    
    # Check if the subfolder exists in both base directories
    if os.path.isdir(inat_subfolder_path) and os.path.isdir(gbif_subfolder_path):
        
        # Get all CSV files in the subfolder
        inat_csv_files = [f for f in os.listdir(inat_subfolder_path) if f.endswith('.csv')]
        gbif_csv_files = [f for f in os.listdir(gbif_subfolder_path) if f.endswith('.csv')]
        
        # Create a mapping of base file names (before the underscore)
        inat_csv_mapping = {get_base_name(f): f for f in inat_csv_files}
        gbif_csv_mapping = {get_base_name(f): f for f in gbif_csv_files}
        
        # Find common base names between the two directories
        all_base_names = set(inat_csv_mapping.keys()).union(gbif_csv_mapping.keys())
        
        for base_name in all_base_names:
            if base_name in inat_csv_mapping and base_name in gbif_csv_mapping:
                # Both CSV files exist, concatenate them
                inat_csv_path = os.path.join(inat_subfolder_path, inat_csv_mapping[base_name])
                gbif_csv_path = os.path.join(gbif_subfolder_path, gbif_csv_mapping[base_name])
                
                # Read the CSV files
                inat_df = pd.read_csv(inat_csv_path)
                gbif_df = pd.read_csv(gbif_csv_path)
                
                # Concatenate the dataframes
                concatenated_df = pd.concat([inat_df, gbif_df])
                
                # Save the concatenated dataframe to the output directory
                output_csv_name = f"{base_name}_concatenated.csv"
                output_csv_path = os.path.join(output_subfolder_path, output_csv_name)
                concatenated_df.to_csv(output_csv_path, index=False)
                
                print(f"Concatenated {inat_csv_mapping[base_name]} and {gbif_csv_mapping[base_name]} into {output_csv_name}")
            
            elif base_name in inat_csv_mapping:
                # Only the inaturalist CSV exists, copy it
                inat_csv_path = os.path.join(inat_subfolder_path, inat_csv_mapping[base_name])
                output_csv_name = f"{inat_csv_mapping[base_name]}"
                output_csv_path = os.path.join(output_subfolder_path, output_csv_name)
                
                # Copy the file
                shutil.copy(inat_csv_path, output_csv_path)
                
                print(f"Copied {inat_csv_mapping[base_name]} from inaturalist results to {output_csv_name}")
            
            elif base_name in gbif_csv_mapping:
                # Only the GBIF CSV exists, copy it
                gbif_csv_path = os.path.join(gbif_subfolder_path, gbif_csv_mapping[base_name])
                output_csv_name = f"{gbif_csv_mapping[base_name]}"
                output_csv_path = os.path.join(output_subfolder_path, output_csv_name)
                
                # Copy the file
                shutil.copy(gbif_csv_path, output_csv_path)
                
                print(f"Copied {gbif_csv_mapping[base_name]} from GBIF results to {output_csv_name}")
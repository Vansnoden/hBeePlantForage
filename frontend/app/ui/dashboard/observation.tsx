import { ObservationRow } from '@/app/lib/definitions';
import { lusitana } from '../fonts';


export function ObservationItem(props:{ obs:ObservationRow }) {
  return (
    <div>
      <div className={`${lusitana.className} grid grid-cols-2`}>
        <div>
            <b>Site Name</b><br/>
        </div>
        <div>
            <span>{props.obs.site}</span><br/>
        </div>
      </div>
      <hr/>
      <div className={`${lusitana.className} grid grid-cols-2`}>
        <div>
          <b>Plant Specie Name</b><br/>
        </div>
        <div>
          <span>{props.obs.specie_name}</span><br/>
        </div>
      </div>
      <hr/>
      <div className={`${lusitana.className} grid grid-cols-2`}>
        <div>
          <b>Country</b><br/>
        </div>
        <div>
          <span>{props.obs.country}</span><br/>
        </div>
      </div>
      <hr/>
      <div className={`${lusitana.className} grid grid-cols-2`}>
        <div>
          <b>Is Invasive</b><br/>
        </div>
        <div>
          <span>{props.obs.class}</span><br/>
        </div>
      </div>
      <hr/>
      <div className={`${lusitana.className} grid grid-cols-2`}>
        <div>
          <b>Year</b><br/>
        </div>
        <div>
          <span>{props.obs.year}</span><br/>
        </div>
      </div>
      <hr/>
    </div>  
  );
}
<?php

namespace AppBundle\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use FOS\RestBundle\Controller\FOSRestController;
use AppBundle\Entity\Task;

class TaskApiController extends FOSRestController
{

	public function getTasksAction(Request $request) {
		
		$response = array('data' => array());
		
		$er = $this->getDoctrine()->getManager()->getRepository('AppBundle:Task')
				   ->createQueryBuilder('t')
				   ->andWhere('t.deleted = :deleted')
				   ->setParameter('deleted', false)
				   ->andWhere('t.clientIp = :clientIp')
				   ->setParameter('clientIp', $_SERVER['REMOTE_ADDR'])
				   ->addOrderBy('t.dateCreated', 'ASC');
					
		$tasks = $er->getQuery()->getResult();
		if ($tasks) {
			foreach($tasks as $task) {
				$response['data'][] = array(
					'type' => 'tasks',
					'id' => $task->getId(),
					'attributes' => array(
						'title' => $task->getTitle(),
						'name' => 'todo-' . $task->getId(),
						'error' => '',
						'editing' => false,
						'completed' => $task->getCompleted(),
						'deleted' => $task->getDeleted()
					),
				);
			}
			return new JsonResponse($response, 200);
		}
		$response = array('data' => array());
		return new JsonResponse($response, 200);
		
	}
	
	public function getTaskAction($id) {

		$response = array('data' => array());
		
		if(is_numeric($id)) {
			$er = $this->getDoctrine()->getManager()->getRepository('AppBundle:Task')
					   ->createQueryBuilder('t')
					   ->where('t.id = :taskId')
					   ->setParameter('taskId', $id)
					   ->andWhere('t.deleted = :deleted')
					   ->setParameter('deleted', false)
					   ->andWhere('t.clientIp = :clientIp')
					   ->setParameter('clientIp', $_SERVER['REMOTE_ADDR']);
					   
			$task = $er->getQuery()->getResult();
			if($task) {
				$response['data'] = array(
					'type' => 'tasks',
					'id' => $task[0]->getId(),
					'attributes' => array(
						'title' => $task[0]->getTitle(),
						'name' => 'todo-' . $task[0]->getId(),
						'error' => '',	
						'editing' => false,
						'completed' => $task[0]->getCompleted(),
						'deleted' => $task[0]->getDeleted()
					),
				);
				return new JsonResponse($response, 200);
			}
		}
		return new JsonResponse($response, 404);
	}

	public function postTasksAction(Request $request) {

		$response = array('data' => array());
		
		$data = json_decode($request->getContent());
		
		if($data) {
			
			$task = new Task();
			$task->setTitle($data->data->attributes->title);
			$task->setCompleted($data->data->attributes->completed);
			$task->setDeleted($data->data->attributes->deleted);
			
			$er = $this->container->get('doctrine')->getEntityManager();
			$er->persist($task);
			$er->flush();

			$response['data'] = array(
				'type' => 'tasks',
				'id' => $task->getId(),
				'attributes' => array(
					'title' => $task->getTitle(),
					'name' => 'todo-' . $task->getId(),
					'error' => '',
					'editing' => false,
					'completed' => $task->getCompleted(),
					'deleted' => $task->getDeleted()
				),
			);
			
			return new JsonResponse($response, 200);
		}
		return new JsonResponse($response, 400);
	}
	
	public function putTaskAction(Request $request) {
		
		$response = array('data' => array());
		 
		$data = json_decode($request->getContent());

		if($data) {

			$id = $data->data->id;
			$title = $data->data->attributes->title;
			$completed = $data->data->attributes->completed;
			$deleted = $data->data->attributes->deleted;
			
			if($title && is_numeric($id)) {
				
				$er = $this->getDoctrine()->getManager()->getRepository('AppBundle:Task')
				->createQueryBuilder('t')
				->update()
				->set('t.title', ':title')
				->setParameter('title', $title)
				->set('t.completed', ':completed')
				->setParameter('completed', $completed)
				->set('t.deleted', ':deleted')
				->setParameter('deleted', $deleted)
				->set('t.lastModified', ':lastModified')
				->setParameter('lastModified', new \DateTime())
				->where('t.id = :taskId')
				->setParameter('taskId', $id);
				
				$er->getQuery()->getResult();
				
				$er = $this->getDoctrine()->getManager()->getRepository('AppBundle:Task')
				->createQueryBuilder('t')
				->where('t.id = :taskId')
				->setParameter('taskId', $id);
				
				$task = $er->getQuery()->getResult();
				
				if($task) {
					
					$response['data'] = array(
						'type' => 'tasks',
						'id' => $task[0]->getId(),
						'attributes' => array(
							'title' => $task[0]->getTitle(),
							'name' => 'todo-' . $task[0]->getId(),
							'error' => '',
							'editing' => false,
							'completed' => $task[0]->getCompleted(),
							'deleted' => $task[0]->getDeleted()
						),
					);
					
					return new JsonResponse($response, 200);
				}
			}
		}
		
		return new JsonResponse($response, 400);
	}
	
	
	public function updateAction(Request $request) {
		
		$response = array('data' => array());
		
		$data = json_decode($request->getContent());
		
		if($data) {

			$id = $data->data->id;
			$title = $data->data->attributes->title;
			$completed = $data->data->attributes->completed;
			$deleted = $data->data->attributes->deleted;
			
			if($title && is_numeric($id)) {
				
				$er = $this->getDoctrine()->getManager()->getRepository('AppBundle:Task')
				->createQueryBuilder('t')
				->update()
				->set('t.title', ':title')
				->setParameter('title', $title)
				->set('t.completed', ':completed')
				->setParameter('completed', $completed)
				->set('t.deleted', ':deleted')
				->setParameter('deleted', $deleted)
				->set('t.lastModified', ':lastModified')
				->setParameter('lastModified', new \DateTime())
				->where('t.id = :taskId')
				->setParameter('taskId', $id);
				
				$task = $er->getQuery()->getResult();
				if($task) {
					
					$response['data'] = array(
						'type' => 'tasks',
						'id' => $task[0]->getId(),
						'attributes' => array(
							'title' => $task[0]->getTitle(),
							'name' => 'todo-' . $task[0]->getId(),
							'error' => '',
							'editing' => false,
							'completed' => $task[0]->getCompleted(),
							'deleted' => $task[0]->getDeleted()
						),
					);
					return new JsonResponse($response, 200);
				}
				
			}
			
		}
		
		return new JsonResponse($response, 400);
		
	}
	
	public function deleteAction($id) {
		
		$response = array('data' => array());
		
		if(is_numeric($id)) {
				
			$er = $this->getDoctrine()->getManager()->getRepository('AppBundle:Task')
			   ->createQueryBuilder('t')
			   ->update()
			   ->set('t.deleted', ':deleted')
			   ->setParameter('deleted', true)
			   ->set('t.lastModified', ':lastModified')
			   ->setParameter('lastModified', new \DateTime())
			   ->where('t.id = :taskId')
			   ->setParameter('taskId', $id);
					   
			$er->getQuery()->getResult();
			
			$er = $this->getDoctrine()->getManager()->getRepository('AppBundle:Task')
			->createQueryBuilder('t')
			->where('t.id = :taskId')
			->setParameter('taskId', $id);
			
			$task = $er->getQuery()->getResult();
			
			if ($task) {
				
				$response['data'] = array(
					'type' => 'tasks',
					'id' => $task[0]->getId(),
					'attributes' => array(
						'title' => $task[0]->getTitle(),
						'name' => 'todo-' . $task[0]->getId(),
						'error' => '',
						'editing' => false,
						'completed' => $task[0]->getCompleted(),
						'deleted' => $task[0]->getDeleted()
					),
				);
				
				return new JsonResponse($response, 200);
			}
		}
		return new JsonResponse($response, 400);
	}
	
}
